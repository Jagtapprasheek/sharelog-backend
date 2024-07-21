// const bcrypt = require('bcrypt');
const {User} = require('../models/User.js');
const {Chart} = require('../models/Chart.js');


module.exports.getUserController = async (req, res) =>{
    try{

        return res.status(200).json({ message : "Test"});
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

module.exports.getHoldings = async (req, res) =>{
    try{
        if(req.isAuthenticated()) {
            var items= []
        
            const options = {
                method: 'GET',
                url: 'https://api.dhan.co/holdings',
                headers: {'access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwicGFydG5lcklkIjoiIiwiZXhwIjoxNzIzMjc2MTEwLCJ0b2tlbkNvbnN1bWVyVHlwZSI6IlNFTEYiLCJ3ZWJob29rVXJsIjoiIiwiZGhhbkNsaWVudElkIjoiMTEwMDY4NzY5NyJ9.fF9_mFgdA5kTM9wYaLAudjcJwjUEolWnBruhTrQ_6ugqq5ctaEO5CPmTI59U02G99bsuGaCwn3BduuWQoj5rpQ', Accept: 'application/json'}
            };
    
            
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                console.log(JSON.parse(body));
                if(JSON.parse(body).httpStatus ==  "BAD_REQUEST")
                {
                    items= []
                }
                else
                    items= items.concat(JSON.parse(body));
                var hasRecording = new Boolean(0);
                const googleClientId= req.session.passport.user.google_client_id;
                var themeThis= "none";
                getThemeById(googleClientId)
                .then(theme => {
                    themeThis= theme;
                    res.render("Holdings.ejs", 
                    {
                        theme: themeThis,
                        imgSrc: req.session.passport.user.profile_pic,
                        PageTitle: "Holdings",
                        Name: req.session.passport.user.name.split(" ")[0],
                        list: items, 
                        isavailable: hasRecording
                    });
                })
                .catch(err => {
                    console.error("Error:", err);
                });
                
            });
    
        } else {
            res.redirect("/Home")
        }   
        return res.status(200).json({ message : "Test"});
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

