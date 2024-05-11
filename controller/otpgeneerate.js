const OTP=require("../models/UserOTPVerification");
const generateOTP=require("../utils/generateOTP");

const sendOTP = async ({email,subject, message,duration=1})=>{
   try{
   if (!(email && subject && message)){
    throw Error ("Provide Values for email,subject,message");
   }
   await deleteOne({email});
   const generateOTP =await generateOTP();
   await sendEmail(mailoption);
   const saltRounds = 10;
   const hashedOTP= await bcrypt 
   }
   catch(error){
 
   }
}
exports.otp = catchAsyncErrors(async (req, res, next) => {

    try{
     const {email,subject,message,duration}=req.body;
    } catch(error){

    }
  });
  