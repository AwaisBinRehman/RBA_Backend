const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
const UserOTPVerificationSchema = new mongoose.Schema({
    userId:String,
    otp:String,
    createdAT:Date,
    expiresAT:Date
});


module.exports = mongoose.model('UserOTPVerification',UserOTPVerificationSchema);