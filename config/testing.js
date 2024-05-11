exports.adduser = catchAsyncErrors(async (req, res,next) => {
    User.findOne({ email: req.body.email }).exec(async (error, users) => {
      if (users)
        return res.status(400).json({
          error: "User already registered",
        });
        
    const otp=`${Math.floor(10000 + Math.random()*90000).toString()}`;
    const expirationTime = new Date().getTime() + 5  * 60 * 1000;
    const UserObj = {
      btitle: req.body.btitle,
      slug: slugify(req.body.btitle),
      country: req.body.country,
      office_Address: req.body.office_Address,
      applicant_Name: req.body.applicant_Name,
      applicant_fName: req.body.applicant_fName,
      contact_Number: req.body.contact_Number,
      applicant_Designation: req.body.applicant_Designation,
      applicant_MotherName: req.body.applicant_MotherName,
      applicant_Birthplace: req.body.applicant_Birthplace,
      Individual_Business_Partnership: req.body.Individual_Business_Partnership,
      email: req.body.email,
      password: req.body.password,
      cpassword: req.body.cpassword,
      verified:false,
      otp:otp,
      otpExpiration:expirationTime
    }
   
    if (req.files && req.body.filename) {
      UserObj.upload_profile = req.body.filename;
      UserObj.upload_certificate= req.body.filename;
  
    } 
    if (req.body.password !== req.body.cpassword) {
      console.log(UserObj.password +"and cpass"+UserObj.cpassword);
  
      return res.status(400).json({
        message: "Password does not match",
      });
    }
    
    const user= new TempUser({ email, phonenumber, otp,otpExpiration: expirationTime });
    await user.save();
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
         port: 587,
      service: 'gmail',
      auth: {
        user: 'roboticworldtest@gmail.com',
       pass: 'qcbwcjmmdsipxqun',
      },
    });
    const mailOptions = {
      from:'noshabakhan767@gmail.com',
      to: user.email,
      subject: ' RBA OTP for user registration',
      text: `Your OTP is ${otp}.It will expire in 5 minutes..`,
    };
    await transporter.sendMail(mailOptions);
  
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
      otp
    });
  
  })
  
      });
      exports.verifyotp = catchAsyncErrors(async (req, res) => {
        const {email,otp}=req.body;
        const user = await User.findOne({ email, otp, otpExpiration: { $gt: Date.now() } });
        
        if (!user) {
          return res.status(400).json({ message: 'Invalid OTP' });
        }
    
        // Clear OTP and OTP expiration in user model
        user.verified = true;
        user.otp = undefined;
        user.otpExpiration = undefined;
        await user.save();
    
        res.status(200).json({ message: 'Email verified and user registered' });
        });