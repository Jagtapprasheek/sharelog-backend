const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
    securityId: String,
    tradingSymbol: String,
    audioObject: String,
    text: String,
    ISIN: String,
    buyQty: String,
    inDepos: String,
    availabelQty: Number,
    avgCostPrice: Number
})

module.exports.Holding = mongoose.model('Holding', holdingSchema);
module.exports.holdingSchema = holdingSchema;