'use strict';

var serialport =  require("serialport");

module.exports = function(port) {
  var SerialPort = serialport.SerialPort;
  var serialPort = new SerialPort(port, {
    parser: serialport.parsers.readline("\n"),
    baudrate: 9600
  });

  return {
    startRead: function(onDataCb) {
      serialPort.on('open', function() {
        console.log('Serial Port Opened');
        serialPort.on('data', function(data) {
          onDataCb(data.toString("ascii"));
        });
      });
    }
  }
}
