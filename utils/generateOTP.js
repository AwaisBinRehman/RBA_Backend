
const bcrypt = require("bcrypt");
// const UserOTPVerification = require("../models/UserOTPVerification");
const nodemailer = require("nodemailer");
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/user');
  let transporter =  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
     auth: {
      user: "roboticworldtest@gmail.com",
      pass:  "qcbwcjmmdsipxqun",
        },
    
  });

   transporter.verify(function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ');
    }
  });
 


const sendOTPVerificationEmail = async( req, res) => {
  try{
    
    const otp=`${Math.floor(10000 + Math.random()*90000).toString()}`;
    const expirationTime = new Date().getTime() + 5  * 60 * 1000;
 
       const saltRounds =10;
       const hashedOTP = await bcrypt.hash(otp,saltRounds);
       const userOtp = await new User({
        
         otp:otp,
         otpExpiration:expirationTime,
         
       });
     await userOtp.save({validateBeforeSave: false});
     const mailOptions = {
      from:'"Noshaba khan"<leon.kertzmann32@ethereal.email>',
      to: email,
      subject: "verify your Email",
       html: `<p>Enter ${otp}  this verify your email address For Right Brand Application</p><p>This code <b>Expire in 1hrs</b></p>`,
        };
     await transporter.sendMail(mailOptions);
    res.status(201).json({
      status:"pending",
      message:"Verification Email Sent in Your Email",
      data:{
       email,
      }
    });
  }catch (error){
    res.status(401).json({
      status:"Failed",
      message:error.message,
     
    });
  }
 };
//  const verifyotp= catchAsyncErrors(async (req, res, next) => {
//   try{
//     let {userId,otp}=req.body;
//     if(!userId||!otp ){
//        throw Error("Empty otp details are not Allowed"); 
//     }else{
//      const UserOTPVerificationRecords= await UserOTPVerification.find({
//         userId,
//       });
//       if(UserOTPVerificationRecords.length <=0 ){
//         throw Error("Account can not b exist or its already be verified please signup again"); 

//       }
//       else{
//        const {expiresAT }= UserOTPVerificationRecords[0];
//       }
//       const hashedOTP = UserOTPVerificationRecords[0].otp;
//       if(expiresAT < Date.now()){
//         await UserOTPVerification.deleteMany({userId});
//         throw new Error("code has been exprire please try again");
//       }
//       else{
//          const  validOTP = await bcrypt.compare(otp,hashedOTP);
//          if (!validOTP){
//            throw Error ("code invalid")
//          }
//          else{
//           await User.updateOne({_id:userId},{verified:true});
//           await UserOTPVerification.deleteMany({userId});
//           res.status(200).json({
//             status:"Verified",
//             message:"Your Email has been Verified"
            
//           })
//          }
//       }
//     }
// }catch(error){
//   res.status(401).json({
//     status:"Failed",
//     message:error.message,
   
//   });
// }

// });

   


module.exports=sendOTPVerificationEmail;
// module.exports= verifyotp;