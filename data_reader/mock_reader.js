'use strict';
var _ = require('underscore');
var sprintf = require('sprintf-js').sprintf;


module.exports = {
  startRead: function(onDataCb) {
    setInterval(function() {
      var data = generateData();
      onDataCb(data);
    }, 3000);
  }
};

function generateData() {
  var data = {
    gas: _.random(0, 100),
    temp: _.random(0, 100),
    hum: _.random(0, 100)
  }
  return sprintf('<Gas: %(gas).2f[PPM]>		<Temperatura: %(temp).2f[*C]>		<Humedad: %(hum).2f[%%]>', data);
}
