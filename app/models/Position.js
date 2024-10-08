const mongoose = require('mongoose');
const { audioSchema } = require('./Audio');
const { chartSchema } = require('./Chart');


const positionSchema = new mongoose.Schema({
    securityId: String,
    tradingSymbol: String,
    audioObject: audioSchema,
    text: String,
    posType: String,
    segmentType: String,
    costPrice: Number,
    buyQty: Number,
    profit: Number,
    NetPnL:Number,
    brokerage: Number,
    drvExpiryDate: String,
    chart: chartSchema,
    dateOfBuy: String,
    dayOfBuy: String,
    strategyUsed: String,
    multiplier: Number,
    curBalance: Number
})

module.exports.Position = mongoose.model('Position', positionSchema);
module.exports.positionSchema = positionSchema;