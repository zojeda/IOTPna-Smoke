var mongoose = require('mongoose');

var SignalSchema = new mongoose.Schema({
  temperature: Number,
  smoke: Number,
  time : { type : Date, default: Date.now }
}, { capped: 1024 });




module.exports=mongoose.model('signal', SignalSchema);
