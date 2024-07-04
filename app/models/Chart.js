const mongoose = require('mongoose');

const chartSchema = new mongoose.Schema({
    open: [Number],
    high: [Number],
    low: [Number],
    close: [Number],
    time: [Number]
})

module.exports.Chart = mongoose.model('Chart', chartSchema);
module.exports.chartSchema = chartSchema