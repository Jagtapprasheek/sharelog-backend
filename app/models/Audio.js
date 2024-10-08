const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
    audId: String,
    audio: {
        data: Buffer, 
        contentType: String 
    }
})

module.exports.Audio = mongoose.model('Audio', audioSchema);
module.exports.audioSchema = audioSchema;