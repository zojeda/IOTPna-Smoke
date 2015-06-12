'use strict';

var db = require('./data_storage');

var config = {
  mongodb: 'mongodb://localhost/test_db'
};

var sensor1 = db.create(config);
sensor1.read();
