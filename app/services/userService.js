const { User } = require("../models/User");

class UserService {
    static async createUser(data) {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1; // January is 0!
        const year = today.getFullYear();
        const formattedToday = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
        
        try {
            const newUser = new User({
                google_client_id: data.google_client_id,
                name: data.name,
                email: data.email,
                contact: "",
                profile_pic: data.profile_pic,
                theme: "dark",
                dhan_key: "",
                // zerodha_key: "",
                razorpay_id: "",
                period: "trial",
                start_day: formattedToday,
                Total_Positions: 0,
                Total_Holdings: 0,
                Total_Equities: 0,
                Total_FAndO: 0,
                Total_Currencies: 0,
                Total_Commodities: 0,
                Total_Trades: 0,
                Total_Brokerage: 0, //- from unrealized profit
                Biggest_Profit: 0,
                Biggest_Loss: 0,
                Best_Day_For_Trade: "",
                Best_Strategy: "",
                Best_Strategy_Rating: 0,
                Best_Lot_Size: 0,
                Strategies: [],
                curBalance: 0,
                Positions: [], 
                Holdings: [],
                Calendar: [],
                Setup: [],
                NetPnL: 0
            });
            const savedUser = await newUser.save();
            return savedUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;  
        }
    }
}

module.exports = UserService;