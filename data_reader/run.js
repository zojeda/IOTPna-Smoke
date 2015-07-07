'use strict';

var db = require('./data_storage');

var config = {
  mongodb: 'mongodb://hxpws-zojeda/test_db',
  reader: require('./data_storage/serialReader')('COM4')
};

var sensor1 = db.create(config);
sensor1.connect();

setInterval(function() {
  sensor1.read();
}, 1000);
