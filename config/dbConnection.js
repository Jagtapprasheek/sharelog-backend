module.exports = {
    production: {
      url: process.env.MONGODB_URI,
      options: { useNewUrlParser: true, useUnifiedTopology: true }
    }
};