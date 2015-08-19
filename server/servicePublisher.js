var mdns = require('mdns');



module.exports = function(server) {
    var ad = mdns.createAdvertisement(mdns.tcp('sensorGrid'), server.address().port, {name: 'hx Sensor Grid'});
    ad.start();
  } ;
