var mongoose = require('mongoose');
var Threshold = require('./models/Threshold');

module.exports = {
    validate: function (signal, notification) {
        Threshold.find({}, function(err, docs) {
            if (!err){ 
                for(var threshold in docs) {
                    validate(signal, docs[threshold].type, docs[threshold].min, docs[threshold].max, notification);
                }
            } else {
                throw err;
            }
        }); 
    }
};

function validate(signal, type, min, max, notification) {
    var mensaje = "";
    var intervalo = "[" + min + ";" + max + "]";
    
    switch (type) {
        case "thermometer":
            if(signal.temperature < min || signal.temperature > max) {
                mensaje = "La temperatura está fuera del intervalo permitido " + 
                                intervalo + 
                                ". Valor: " + signal.temperature + " ºC";
                notification.send(mensaje);
            }
        break;
        case "smoke":
            if(signal.smoke < min || signal.smoke > max) {
                mensaje = "El nivel de humo está fuera del intervalo permitido " + 
                                intervalo + 
                                ". Valor: " + signal.smoke + " PPM";
                notification.send(mensaje);
            }
        break;
        case "humidity":
            if(signal.humidity < min || signal.humidity > max) {
                mensaje = "La humedad está fuera del intervalo permitido " + 
                                intervalo + 
                                ". Valor: " + signal.humidity + "%";
                notification.send(mensaje);
            }
        break;
    }
}