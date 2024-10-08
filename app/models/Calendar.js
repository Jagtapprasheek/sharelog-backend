const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
    securityIds: [String],
    date: String,
    equity: Number,
    fAndO: Number,
    commodity: Number,
    currency: Number,
    balance: Number
})

module.exports.Calendar = mongoose.model('Calendar', calendarSchema);
module.exports.calendarSchema = calendarSchema;