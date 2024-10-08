// const bcrypt = require('bcrypt');
const {User} = require('../models/User.js');
const {Chart} = require('../models/Chart.js');
const {Position} = require('../models/Position.js');
const {Calendar} = require('../models/Calendar.js');
const { createUser } = require('../services/userService.js');
const jwt = require('jsonwebtoken');
const { getAllPositions, getChartData, addTenYears, calculateBrokerage, getEndDate, getFakeChartData, getLocalDayName, getLocalDate, getCurBalance, findCalendarEntryForToday, filterPositionsLastWeek } = require('../utils/util.js');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports.getUser = async (req, res) =>{
    try{
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = await ticket.getPayload();

        let user = await User.findOne({ google_client_id: payload.sub });
        if (!user) {
            await createUser({
                google_client_id: payload.sub,
                name: payload.name,
                email: payload.email,
                profile_pic: payload.picture
            })
        }
        const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ message : "Login Successfull", token : jwtToken});
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}