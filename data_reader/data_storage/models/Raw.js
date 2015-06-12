var mongoose = require('mongoose');

var RawSchema = {
  data: String
};

module.exports = mongoose.model('raw', RawSchema);
