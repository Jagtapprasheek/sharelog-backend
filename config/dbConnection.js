export default {
    production: {
      url: process.env.MONGODB_URI,
      options: { useNewUrlParser: true, useUnifiedTopology: true }
    }
};