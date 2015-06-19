'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');
var Raw = require('./models/Raw');
var Signal = require('./models/Signal');

var defaultConfig = {
  mongodb: 'mongo://localhost/db_test',
  reader: require('./mock_reader')
};

module.exports = {
  create: function(config) {
    return new Reader(_({}).extend(defaultConfig, config));
  }
};

function Reader(config) {
  var self = this;
  this.cfg = config || {};
  this.connect = function() {
    mongoose.connect(this.cfg.mongodb);
  };

  this.disconnect = function() {
    mongoose.connection.close();
  };

  this.read = function() {
      this.connect();
      this.cfg.reader.read()
        .then(this.saveRawData)
        .then(this.saveData)
        .then(this.disconnect);
    },

    this.saveRawData = function(data) {
      Raw.create({
        data: data
      });
      return data;
    };

  this.saveData = function(data) {
    console.log('saving data : ' + data);
    var signal = self.parseData(data);
    Signal.create(signal);
    return signal;
  };

  this.parseData = function(data) {
    console.log('parsing data : ' + data);
    var vars = {};
    data.split('&').forEach(function(variable) {
      var entry = variable.split('=');
      vars[entry[0]] = entry[1];
    });
    return new Signal({
      temperature: vars.temp,
      smoke: vars.smoke
    });
  }
}
