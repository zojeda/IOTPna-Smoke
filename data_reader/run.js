'use strict';

var db = require('./data_storage');

var config = {
  mongodb: 'mongodb://hxpws-zojeda/test_db',
  //reader: require('./data_storage/serialReader')('COM4')
  parseData : function(data) {
    var matches = data.match(/<Gas:\s*([\d+.]*)\[.{1,3}\]>\s*<Temperatura:\s*([\d+.]*)\[.{1,3}\]>\s*<Humedad:\s*([\d+.]*)\[.{1,3}\]>/)
    return {
      temperature: matches[2],
      humidity: matches[3],
      smoke: matches[1]
    };
  }
};

var sensor1 = db.create(config);
sensor1.connect();

sensor1.startRead();
