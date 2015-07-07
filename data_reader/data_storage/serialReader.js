'use strict';

var Promise = require('promise');

var lastValue;
module.exports = function(port) {
  var SerialPort = require("serialport").SerialPort;
  var serialPort = new SerialPort(port);

  serialPort.on('open', function() {
    console.log('Serial Port Opend');
    serialPort.on('data', function(data) {
      lastValue = data.toString("ascii");
    });
  });
  return {
    read: function() {
      return new Promise(function(resolve, reject) {
        console.log(lastValue)
        //<Gas: 23.00[PPM]>		<Temperatura: 14.00[*C]>		<Humedad: 78.00[%]>
        return resolve(lastValue);
      });

    }
  }
}
