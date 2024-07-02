const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type : Number,
        required : true
    },
    user_name: {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
    },
    created_on : {
        type: Date,
        default : Date.now
    },
    modified_on : {
        type: Date
    },
    modified_by : {
        type: String,
    },
    created_by : {
        type: String
    }
})


module.exports = mongoose.model('User', userSchema);