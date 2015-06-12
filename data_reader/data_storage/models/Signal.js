var mongoose = require('mongoose');

var SignalSchema = {
  temperature: Number,
  smoke: Number
};

module.exports = mongoose.model('signal', SignalSchema);
