// const bcrypt = require('bcrypt');
import { User } from '../models/User.js';
import { Chart } from '../models/Chart.js';
import { Position } from '../models/Position.js';
import { Calendar } from '../models/Calendar.js';
import jwt from 'jsonwebtoken';
import { 
  getAllPositions, 
  getChartData, 
  addTenYears, 
  calculateBrokerage, 
  getEndDate, 
  getFakeChartData, 
  getLocalDayName, 
  getLocalDate, 
  getCurBalance, 
  findCalendarEntryForToday, 
  filterPositionsLastWeek 
} from '../utils/util.js';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const getUser = async (req, res) =>{
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