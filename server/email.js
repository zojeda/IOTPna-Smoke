var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var mongoose = require('mongoose');
var Receiver = require('./models/Receiver');
var configuration = require('../config.json');

var defaultEmailTemplate = {
    subject: "Alerta de Smoke Detector",
    title: "<h3>Smoke Detector</h3>",
    subtitle: "<p>¡Algo salió mal! Por favor, consulte los detalles del error para obtener más información.</p>"
};

module.exports = {
  create: function() {
      return new Notification();
  }
};

function Notification() {
    var self = this;
    
    this.send = function (message) {
        Receiver.find({}, function(err, docs) {
            if (!err){ 
                sendEmail(message, EmailJsonToString(docs));
            } else {
                throw err;
            }
        });
    };    
    
    this.createReceiver = function (receiver) {
        Receiver.create({
            name: receiver.name,
            email: receiver.email
        });

        return receiver;
    }
}

function sendEmail(message, receivers){
    var transport = nodemailer.createTransport(smtpTransport({
        host: configuration.smtp.host,
        port: configuration.smtp.port,
        auth: {
            user: configuration.smtp.user,
            pass: configuration.smtp.pass
        }
    }));
    
    transport.sendMail({
       from: configuration.smtp.from,
       to: receivers, // comma separated list of receivers
       subject: defaultEmailTemplate.subject,
       html: defaultEmailTemplate.title + 
                defaultEmailTemplate.subtitle + 
                "<p></br><b>Detalle del error: </b>" + message + "</p>" 
    }, sendEmailResult);
}

function sendEmailResult(error, info){
   if(error){
       console.log("Email failed. " + error);
   }else{
       console.log("Message sent. Response: " + info.response);
   }
}

function EmailJsonToString(json){
    var emails = "";
    for(var receiver in json){
        emails += json[receiver].name + " <" + json[receiver].email + ">,";
    }
    if(emails.length > 0)
    {
        emails = emails.substring(0, emails.length - 1);
    }
    return emails;
}