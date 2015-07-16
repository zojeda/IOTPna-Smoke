var mongoose = require('mongoose');

var RawSchema = {
  data: String,
  time : { type : Date, default: Date.now }
};

module.exports = mongoose.model('raw', RawSchema);
