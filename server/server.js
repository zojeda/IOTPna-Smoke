var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {'transports': ['websocket', 'polling']});
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var mongoose = require('mongoose');
var Receiver = require('./models/Receiver');

app.use(express.static('../client/dist'));

app.get('/', function(req, res) {
  res.sendFile('../client/dist' + '/index.html');
});

var subscriber = require('./subscriber.js');
var configuration = require('../config.json');

connectDb();


function connectDb() {
  subscriber.subscribe(configuration.mongodbUrl, 'signals', onData, onDataError);
}

function onData(signal) {
  lastErrorTailedCursorExhaust = undefined;
  io.emit('data', signal);
  io.emit('status', "receiving data ...");
}

var lastErrorTailedCursorExhaust = undefined;
function onDataError(err) {
  console.log(err);
  if('No more documents in tailed cursor' === err.message) {
    if(lastErrorTailedCursorExhaust && process.hrtime(lastErrorTailedCursorExhaust)[0]>5) {
      io.emit('error', "check datastorage sensor process, it seems to be down");
    } else {
      lastErrorTailedCursorExhaust = lastErrorTailedCursorExhaust ? lastErrorTailedCursorExhaust : process.hrtime();
    }
  } else {
    io.emit('error', err);
  }
  // get receivers and send email to warn about this error
  createEmail(err);
  reconnect();
} 

server.listen(8080, function() {
  if(process.platform==='linux') {
    var mdns = require('mdns');
    var ad = mdns.createAdvertisement(mdns.tcp('sensorGrid'), server.address().port, {name: 'hx Sensor Grid2'});
    ad.start();
  }
});

function reconnect() {
  setTimeout(function() {
    io.emit('status', "trying to reconnect....");      
    connectDb();
  }, 2000);
}

function connect(){
    mongoose.connect(configuration.mongodbUrl);
}

function disconnect(){
    mongoose.connection.close();
}

function createEmail(errorMessage) {
    connect();
    Receiver.find({}, function(err, docs) {
        disconnect();
        if (!err){ 
            sendEmail(errorMessage, EmailJsonToString(docs));
        } else {
            throw err;
        }
    });
}

function sendEmail(errorMessage, receivers){
    var transport = nodemailer.createTransport(smtpTransport({
        host: configuration.smtp.host,
        port: configuration.smtp.port,
        auth: {
            user: configuration.smtp.user,
            pass: configuration.smtp.pass
        }
    }));
    
    transport.sendMail({
       from: configuration.smtp.from,
       to: receivers, // comma separated list of receivers
       subject: "Smoke detector alert",
       html: "<h3>Smoke detector</h3>" + 
                "<p>Something went wrong! Please, see the error details for more information.</br> <b>Error details: </b>" +                    errorMessage + "</p>" 
    }, sendEmailResult);
}

function sendEmailResult(error, response){
   if(error){
       console.log("Email failed. " + error);
   }else{
       console.log("Message sent: " + response.message);
   }
}

function CreateReceiver(receiver) {
    connect();
    Receiver.create({
        name: receiver.name,
        email: receiver.email
    });
    disconnect();
    return data;
}

function EmailJsonToString(json){
    var emails = "";
    for(var receiver in json){
        emails += json[receiver].name + " <" + json[receiver].email + ">,";
    }
    if(emails.length > 0)
    {
        emails = emails.substring(0, emails.length - 1);
    }
    return emails;
}