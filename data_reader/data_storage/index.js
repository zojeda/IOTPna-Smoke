'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');
var Raw = require('./models/Raw');
var Signal = require('./models/Signal');

var defaultConfig = {
  mongodb: 'mongo://localhost/db_test',
  reader: require('../mock_reader')
};

module.exports = {
  create: function(config) {
    var reader = new Reader(_({}).extend(defaultConfig, config));
    return reader;
  }
};

function Reader(config) {
  var self = this;
  this.cfg = config || {};
  this.parseData = this.cfg.parseData || this.defaultParseData ;

  this.connect = function() {
    mongoose.connect(this.cfg.mongodb);
  };

  this.disconnect = function() {
    mongoose.connection.close();
  };

  this.startRead = function() {
      this.cfg.reader.startRead(function(data) {
         self.saveRawData(data);
         self.saveData(data);
      })
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
    console.log('parsed signal : ' + JSON.stringify(signal));
    Signal.create(signal);
    console.log('saved signal ');
    return signal;
  };

  this.defaultParseData = function(data) {
    console.log('parsing data : ' + data);
    var vars = {};
    data.split('&').forEach(function(variable) {
      var entry = variable.split('=');
      vars[entry[0]] = entry[1];
    });
    return {
      temperature: vars.temp,
      smoke: vars.smoke
    };
  }
}
