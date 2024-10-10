// const bcrypt = require('bcrypt');
const {OAuth2Client} = require('google-auth-library');
const {User} = require('../models/User.js');
const {Chart} = require('../models/Chart.js');
const {Position} = require('../models/Position.js');
const {Calendar} = require('../models/Calendar.js');
const jwt = require('jsonwebtoken');
const { getAllPositions, getChartData, addTenYears, calculateBrokerage, getEndDate, getFakeChartData, getLocalDayName, getLocalDate, getCurBalance, findCalendarEntryForToday, filterPositionsLastWeek } = require('../utils/util.js');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


module.exports.getUser = async (req, res) =>{
    try{
        const {userId} = req.user;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        return res.status(200).json({ message : "Test"});
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}


module.exports.getDashboardData = async (req, res) => {
    try{
        const {userId} = req.user;
        const user = await User.findById(userId);
        const googleClientId= user.google_client_id;

        const startDate = user.start_day;
        const futureDate = getEndDate(startDate);
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
        const year = today.getFullYear();
        const todaysDate = `${day}-${month}-${year}`;
        
        // (futureDate == todaysDate && user.period == "trial") // Last day of trial
        let allPositions = await getAllPositions();
        console.log("All Positions: ", allPositions);
        let i= 0;
        for (const thisPosition of allPositions) 
        {
            const buyBrokerageDetails = calculateBrokerage(thisPosition.productType,'BUY', thisPosition.buyQty, thisPosition.buyAvg, 0.03);
            const sellBrokerageDetails = calculateBrokerage(thisPosition.productType,'SELL', thisPosition.sellQty, thisPosition.sellAvg, 0.03);

            console.log("Sell Brokerage Details: ", sellBrokerageDetails);
            let Gst = Math.round((0.18 * (buyBrokerageDetails + sellBrokerageDetails) * 100)) / 100;
            let ift = Math.round(0.000005 * (thisPosition.buyQty * thisPosition.buyAvg + thisPosition.sellQty  * thisPosition.sellAvg) * 100) / 100;

                thisPosition.totalTax = buyBrokerageDetails + sellBrokerageDetails + Gst + ift;
                thisPosition.netPandL = thisPosition.realizedProfit - thisPosition.totalTax;
                console.log("Total Brokerage: ", thisPosition.netPandL);

            let positionExists = false;
            for (const position of user.Positions) 
            {
                if (position.securityId === thisPosition.securityId) {
                    positionExists = false;
                    console.log("Position already exists in DB. Skipping");
                    break;
                }
            }
            if(true){
                console.log("New position. Storing it to DB");
                console.log("Retrieving chart for this position from Dhan");

                var chartData;
                try {
                    chartData= await getChartData(thisPosition.securityId , "NSE_FNO", "OPTIDX");
                }
                catch(err) {
                    chartData= null;
                }

                user.Total_Positions++;
                user.Total_Trades++;
                if(chartData != null && String(chartData.errorCode).toLowerCase() === "none") {
                    console.log("Chart lost as application not opened");
                    chartData = getFakeChartData();
                } 

                const modifiedChartObject = addTenYears(chartData);
                
                var huiChart= {};
                huiChart.open= chartData.open;
                huiChart.high= chartData.high;
                huiChart.low= chartData.low;
                huiChart.close= chartData.close;
                huiChart.time= modifiedChartObject.start_Time;

                chartData= huiChart;

                //! Make amendments for biggest loss, profit etc
                user.Total_Brokerage += thisPosition.unrealizedProfit;

                if(thisPosition.realizedProfit > user.Biggest_Profit) {
                    user.Biggest_Profit = thisPosition.realizedProfit;
                    user.Best_Day_For_Trade = getLocalDayName();
                    user.Best_Lot_Size = thisPosition.buyQty;
                }

                if(thisPosition.realizedProfit < user.Biggest_Loss)
                    user.Biggest_Loss = thisPosition.realizedProfit;

                const positionData = {
                    securityId: thisPosition.securityId,
                    tradingSymbol: thisPosition.tradingSymbol,
                    audioObject: null,
                    text: "",
                    posType: thisPosition.positionType,
                    segmentType: thisPosition.exchangeSegment,
                    costPrice: Math.round(thisPosition.costPrice),
                    buyQty: thisPosition.buyQty,
                    profit: thisPosition.realizedProfit,
                    brokerage: Math.round(thisPosition.totalTax * 100) / 100,
                    NetPnL: Math.round(thisPosition.netPandL * 100) / 100,
                    drvExpiryDate: thisPosition.drvExpiryDate,
                    chart: chartData,
                    dateOfBuy: getLocalDate(),
                    dayOfBuy: getLocalDayName(),
                    strategyUsed: "",
                    multiplier: thisPosition.multiplier,
                    curBalance: await getCurBalance()
                };

                var newPosition = new Position(positionData);
                user.Positions.push(newPosition);
                await user.save();
                console.log("Chart saved");
            }
        }

        //! Calendar Work
        for (const thisPosition of allPositions)
        {
            let posType;
            if(String(thisPosition.exchangeSegment).toLowerCase().includes("fno"))
                posType= "fno";
            else if(String(thisPosition.exchangeSegment).toLowerCase().includes("eq"))
                posType= "eq";
            else if(String(thisPosition.exchangeSegment).toLowerCase().includes("comm"))
                posType= "comm";
            else if(String(thisPosition.exchangeSegment).toLowerCase().includes("curr"))
                posType= "curr";
            
            const secId = thisPosition.securityId;

            const aajKiDateWalaObject= await findCalendarEntryForToday(user);
            console.log("Aaj ki date wala object: ", aajKiDateWalaObject);
            // console.log(aajKiDateWalaObject);
            if(typeof aajKiDateWalaObject === "string")
            {
                console.log("Calendar object not found. Banana padega");
                
                //! Get Balance
                const curBal= await getCurBalance();

                //! make Calendar object 
                let fno= 0, eq= 0, comm= 0, curr= 0;
                if (posType === "fno") {
                    fno++;
                    user.Total_FAndO++;
                }
                else if (posType === "eq"){
                    eq++;
                    user.Total_Equities++;
                }
                else if (posType === "comm"){
                    comm++;
                    user.Total_Commodities++;
                }
                else if (posType === "curr"){
                    curr++;
                    user.Total_Currencies++;
                }

                const calendar = new Calendar({
                    securityIds: [secId],
                    date: getLocalDate(),
                    equity: eq,
                    fAndO: fno,
                    commodity: comm,
                    currency: curr,
                    balance: curBal
                });

                //! Save in user
                await calendar.save();Position
                await user.Calendar.push(calendar);
                await user.save();
            }
            else
            {
                console.log("Ek calendar mila hai");

                if(!aajKiDateWalaObject.securityIds.includes(secId))
                {
                    if (posType === "fno"){
                        aajKiDateWalaObject.fAndO++;
                        user.Total_FAndO++;
                    }
                    else if (posType === "eq"){
                        aajKiDateWalaObject.equity++;
                        user.Total_Equities++;
                    }
                    else if (posType === "comm"){
                        aajKiDateWalaObject.commodity++;
                        user.Total_Commodities++;
                    }
                    else if (posType === "curr"){
                        aajKiDateWalaObject.currency++;
                        user.Total_Currencies++;
                    }
                    
                    aajKiDateWalaObject.securityIds.push(secId);
                    await aajKiDateWalaObject.save({ suppressWarning: true });
                    await user.save();
                }
            }
        }

        
        // console.log("user positions ", user.Positions);
        const positionsLastWeek = await filterPositionsLastWeek(user.Positions);
        console.log("Positions last week: ", user.Positions);
        
        var themeThis= user.theme;
        res.render("Dashboard.ejs", {
            theme: themeThis,
            imgSrc: req.session.passport.user.profile_pic,
            PageTitle: "Dashboard",
            Name: req.session.passport.user.name.split(" ")[0],
            // DateBought: formattedDate,
            // DayBought: dayNames[dayy],
            TypePosOrHold: "P&L",
            PAndL: Number(user.NetPnL).toFixed(2),
            TotStrats: user.Strategies.length,
            TotPos: user.Total_Positions,
            TotHolds: user.Total_Holdings,
            Amount: Number(user.NetPnL).toFixed(2),
            carouselData: positionsLastWeek,
            Strategies: user.Strategies
        });
  
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

module.exports.getPositions = async (req, res) => {
    try{
        const {userId} = req.user;
        const user = await User.findById(userId);
        // const googleClientId= req.session.passport.user.google_client_id;
        // const user = await User.findOne({ google_client_id: googleClientId });
        // let allPositions = await getAllPositions();
        let todaysPositions = getTodaysPositions(user)
        
        var hasRecording = new Boolean(0);
        res.render("Positions.ejs", 
        {
            theme: user.theme,
            imgSrc: user.profile_pic,
            PageTitle: "Positions",
            Name: user.name.split(" ")[0],
            isavailable: hasRecording,
            carouselData: todaysPositions,
            Strategies: user.Strategies
        });
    }catch(error){

    }
}