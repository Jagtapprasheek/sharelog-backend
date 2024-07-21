// const bcrypt = require('bcrypt');
const {User} = require('../models/User.js');
const {Chart} = require('../models/Chart.js');


module.exports.loginController = async (req, res) =>{
    try{
        const { token } = req.body;
        try {
            const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            
            // Check if user exists, if not create new user
            let user = await User.findOne({ google_client_id: payload.sub });
            if (!user) {
            user = new User({
                google_client_id: payload.sub,
                name: payload.name,
                email: payload.email,
                profile_pic: payload.picture,
                // ... other user fields
            });
            await user.save();
            }
        
            // Create JWT
            const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
            return res.status(200).json({ token: jwtToken, user });
        } catch (error) {
            res.status(400).json({ error: 'Invalid token' });
        }
       
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}