var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var subscriber = require('./subscriber.js');



app.use(express.static('../client/dist'));

app.get('/', function(req, res) {
  res.sendFile('../client/dist' + '/index.html');
});

function onData(signal) {
  io.emit('data', signal);

}
function onDataError(err) {
  if('No more documents in tailed cursor'=== err.message) {
    io.emit('error', "check datastorage sensor process, it seems to be down");
  } else {
    io.emit('error', err);
  }


}

subscriber.subscribe('mongodb://hxpws-zojeda/test_db', 'signals', onData, onDataError);

server.listen(8080);
