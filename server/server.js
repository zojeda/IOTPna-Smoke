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
  io.emit('data', signal);
  io.emit('status', "receiving data ...");
}
function onDataError(err) {
  if('No more documents in tailed cursor' === err.message) {
    io.emit('error', "check datastorage sensor process, it seems to be down");
  } else {
    io.emit('error', err);
  }
  setTimeout(function() {
    io.emit('status', "trying to reconnect....");
    connectDb();
  }, 2000);
}




server.listen(8080, function() {
  // advertise a http server on port 4321
  var ad = mdns.createAdvertisement(mdns.tcp('sensorGrid'), server.address().port, {name: 'hx Sensor Grid'});
  ad.start();
} );
