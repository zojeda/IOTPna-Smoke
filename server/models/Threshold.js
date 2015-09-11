var mongoose = require('mongoose');

var ThresholdSchema = {
    type: String,
    min: Number,
    max: Number,
    default: Number
};

module.exports = mongoose.model('threshold', ThresholdSchema);