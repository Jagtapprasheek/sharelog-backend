const mongoose = require('mongoose');
const { positionSchema } = require('./Position');
const { holdingSchema } = require('./Holding');
const { calendarSchema } = require('./Calendar');

const userSchema = new mongoose.Schema({
    google_client_id:  { type: String, unique: true, required: true },
    name: String,
    email: String,
    contact: Number,
    profile_pic: String,
    theme: String,
    dhan_key: String,
    // zerodha_key: String,
    razorpay_id: String,
    period: String,
    start_day: String,
    Total_Positions: Number,
    Total_Holdings: Number,
    Total_Equities: Number,
    Total_FAndO: Number,
    Total_Currencies: Number,
    Total_Commodities: Number,
    Total_Trades: Number,
    Total_Brokerage: Number, //- from unrealized profit
    Biggest_Profit: Number,
    Biggest_Loss: Number,
    Best_Day_For_Trade: String,
    Best_Strategy: String,
    Best_Strategy_Rating: Number,
    Best_Lot_Size: Number,
    Strategies: [[String]],
    curBalance: Number,
    Positions: [positionSchema], 
    Holdings: [holdingSchema],
    Calendar: [calendarSchema],
    Setup: [],
    NetPnL: Number
})

module.exports.User = mongoose.model('User', userSchema);
module.exports.userSchema = userSchema;