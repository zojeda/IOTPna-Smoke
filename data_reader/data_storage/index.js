'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');
var Raw = require('./models/Raw');

var defaultConfig = {
  mongodb: 'mongo://localhost/db_test',
  reader: require('./mock_reader')
};

module.exports = {
  create: function(config) {
    return Reader(_({}).extend(defaultConfig, config));
  }
};

var Reader = (function() {
  return function(config) {
    return {
      cfg: config || {},

      connect: function() {
        mongoose.connect(this.cfg.mongodb);
      },

      disconnect: function() {
        mongoose.connection.close();
      },

      read: function() {
        this.connect();
        this.cfg.reader.read()
          .then(this.saveRawData)
          .then(this.saveData)
          .then(this.disconnect);
      },

      saveRawData: function(data) {
        Raw.create({data: data});
      },

      saveData: function(data) {
        // TODO: call data parser and save data
        // Signal.create(this.parseData(data));
      },

      parseData: function(data) {
        // TODO: data parser (input format TBD)
        // return new Signal({temperature: xx, smoke: xx});
      }

    };
  };
})();
