const generateOTP = async()=>{
 try{
 const otp=`${Math.floor(1000 + Math.random()*9000)}`;
 const mailOptions = {
    from:'"Noshaba khan"<leon.kertzmann32@ethereal.email>',
    to: email,
    subject: "verify your Email",
     html: `<p>Enter ${otp} in the app to verify your email</p>`,
      };
      const saltRounds =10;
      const hashedOTP=await bcrypt.hash(otp,saltRounds);
      new OTP({
        userid:_id,
        otp:hashedOTP,
        createdAT:Date.now,
        expiresAT:Date.now+3600000
        
      });
 
   
 }catch (error){
  throw error
 }
};
module.exports=generateOTP;