var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(server, {'transports': ['websocket', 'polling']});
var mongoose = require('mongoose');
var Threshold = require('./models/Threshold');

var subscriber = require('./subscriber.js');
var configuration = require('../config.json');
var email = require('./email.js');
var notification = email.create();
var threshold = require('./threshold.js');

connect();
connectDb();

app.use(express.static('../client/dist'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function(req, res) {
  res.sendFile('../client/dist' + '/index.html');
});

app.get('/api/thresholds', function(req, res) {
    Threshold.find({}, function(err, thresholds) {
        if (err)
            res.send(err);
        
        res.json(thresholds);        
    });
});

app.get('/api/thresholds/:type', function(req, res) {
    Threshold.find({ type : req.params.type }, function(err, thresholds) {
        if (err)
            res.send(err);
        
        res.json(thresholds);        
    });
});

app.put('/api/thresholds/:type', function(req, res) {
    Threshold.findOneAndUpdate({ type : req.params.type }, { min: req.body.min, max: req.body.max }, function(err, threshold)     {
        if (err)
            res.send(err);

        res.json(threshold);        
    });
});

function connectDb() {
  subscriber.subscribe(configuration.mongodbUrl, 'signals', onData, onDataError);
}

function onData(signal) {
    lastErrorTailedCursorExhaust = undefined;
    io.emit('data', signal);
    io.emit('status', "receiving data ...");
    threshold.validate(signal, notification);
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
  notification.send(err);
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

function connect() {
    mongoose.connect(configuration.mongodbUrl);
};

function disconnect() {
    mongoose.connection.close();
};
