'use strict';

var db = require('./data_storage');

var config = {
  mongodb: 'mongodb://localhost/test_db'
};

var sensor1 = db.create(config);
//var timer = setInterval(sensor1.read, 5000);
sensor1.read();
