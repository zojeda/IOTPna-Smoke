var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var subscriber = require('./subscriber.js');
var configuration = require('../config.json');


app.use(express.static('../client/dist'));

app.get('/', function(req, res) {
  res.sendFile('../client/dist' + '/index.html');
});


connectDb();
server.listen(8080);


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
  reconnect();
}


function reconnect() {
  setTimeout(function() {
    io.emit('status', "trying to reconnect....");
    connectDb();
  }, 2000);
}
