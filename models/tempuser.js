const mongoose = require('mongoose');
const tempUserSchema = new mongoose.Schema({
    email: { type: String, required: true},
    otp: { type: String, required: true },
    otpExpiration: { type: Date },
    
  
});
  
 module.exports = mongoose.model('TempUser',tempUserSchema);

 