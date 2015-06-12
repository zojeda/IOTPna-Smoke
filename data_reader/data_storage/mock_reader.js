'use strict';

var _ = require('underscore');
var Promise = require('promise');

module.exports = {
  read: function() {
      return new Promise(function(resolve, reject) {
        var value = 'temp=' + _.random(0, 100)/100 + '&smoke=' + _.random(0, 100)/100;
        return resolve(value);
      });
  }
};
