var mongoose = require('mongoose');

var ReceiverSchema = {
  name: String,
  email: String
};

module.exports = mongoose.model('receiver', ReceiverSchema);