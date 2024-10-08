const { User } = require("../models/User");

class UserService {
    static async createUser(data) {
        return new Promise(async (resolve, reject) => {
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
                return resolve(savedUser);
            } catch (error) {
                console.error('Error creating user:', error);
                reject(error);  
            }
        })
    }
    static async findUserByGoogleClientId(googleClientId){
        try {
            const user = await User.findOne({ google_client_id: googleClientId });
            return user;
          } catch (error) {
            console.error('Error finding user by Google Client ID:', error);
            throw error;
          }
    }
    static async getThemeById(googleClientId) {
        try {
            const user = await User.findOne({ google_client_id: googleClientId });
    
            if (!user) {
                return ""; 
            }
    
            const theme = user.theme;
    
            return theme;
        } catch (error) {
            return [];
        }
    }
    static async getStrategiesByClientId(googleClientId) {
        try {
            // Find the user with the given google_client_id
            const user = await User.findOne({ google_client_id: googleClientId });

            if (!user) {
                // console.log("User not found");
                return []; // Return an empty array if user not found
            }

            // Access the Strategies field from the user document
            const strategies = user.Strategies;

            return strategies;
        } catch (error) {
            // console.error("Error fetching strategies:", error);
            return []; // Return an empty array in case of error
        }
    }
}

module.exports = UserService;