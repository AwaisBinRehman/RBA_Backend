const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });
const mongoose = require("mongoose");
const url = require('url');
// const databaseURI = process.env.MONGODB_URI;
const MONGODB_URI= process.env.MONGODB_URI.trim();
const connectDatabase = () => {
    const parsedUrl = url.parse(MONGODB_URI);
    const databaseName = parsedUrl.pathname.substring(1); // Extract the database name
  
    mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
      console.log(`Database connected successfully to ${databaseName}`);
    }).catch((err) => {
      console.error(`Database connection error: ${err.message}`);
    });
};

module.exports = connectDatabase;
