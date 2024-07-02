const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()

const username = encodeURIComponent(process.env.MONGO_USERNAME);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const cluster = process.env.MONGO_CLUSTER;

let uri = `mongodb+srv://${username}:${password}@${cluster}.pk6zdw1.mongodb.net/sharelog`
console.log(11, uri)
// let uri = `mongodb://127.0.0.1:27017/test`
mongoose.connect(uri,{
    // serverSelectionTimeoutMS : 600
});     

const db = mongoose.connection;

db.on('error', (err) => console.log(err));
db.once('open', () => console.log("Connected to database"));

const indexRouter = require('./app/routes');
app.use('/api', indexRouter);


app.get('/', (req, res) => {
    return res.status(200).json({ message  : "Welcome to ShareLog"});
})

app.use('*', (req, res) => {
    return res.status(404).json({ message : "path not exists"})
})

const port = process.env.PORT || 8081
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})