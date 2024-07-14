const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()
const bodyParser = require('body-parser');
const session = require("express-session");
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const findOrCreate = require("mongoose-findorcreate");
const cors = require('cors');
const Razorpay = require('razorpay');


app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: "Mera nikka jeya secret.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


const username = encodeURIComponent(process.env.MONGO_USERNAME);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const cluster = process.env.MONGO_CLUSTER;

let uri = `mongodb+srv://${username}:${password}@${cluster}.pk6zdw1.mongodb.net/sharelog`
mongoose.connect(uri);     
const db = mongoose.connection;

db.on('error', (err) => console.log(err));
db.once('open', () => console.log("Connected to database"));


app.get('/api/logout', function(req, res) {
    req.logout();
    return res.json({ success: true });
});

app.get('/api/user', function(req, res) {
    if (req.isAuthenticated()) {
        return res.json({ user: req.user });
    } else {
        return res.status(401).json({ error: 'Not authenticated' });
    }
});


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