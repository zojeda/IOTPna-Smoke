var mongoose = require('mongoose');

var SignalSchema = new mongoose.Schema({
  temperature: Number,
  smoke: Number,
  time : { type : Date, default: Date.now }
}, { capped: { size: 1024, max: 1000, autoIndexId: true } });




module.exports=mongoose.model('signal', SignalSchema);
