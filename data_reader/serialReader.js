'use strict';

module.exports = function(port) {
  var SerialPort = require("serialport").SerialPort;
  var serialPort = new SerialPort(port);

  return {
    startRead: function(onDataCb) {
        serialPort.on('open', function() {
        console.log('Serial Port Opend');
        serialPort.on('data', function(data) {
          onDataCb(data.toString("ascii"));
        });
      });
    }
  }
}
