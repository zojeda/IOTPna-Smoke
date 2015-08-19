var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {'transports': ['websocket', 'polling']});
var mdns = require('mdns');

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
  reconnect();
}


function reconnect() {
  setTimeout(function() {
    io.emit('status', "trying to reconnect....");
    connectDb();
  }, 2000);
}




server.listen(8081, function() {
  // advertise a http server on port 4321
  var ad = mdns.createAdvertisement(mdns.tcp('sensorGrid'), server.address().port, {name: 'hx Sensor Grid2'});
  ad.start();
} );
