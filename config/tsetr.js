exports.signin = catchAsyncErrors(async (req, res, next) => {
    const { email, password,cpassword } = req.body;
  
    // checking if user has given password and email both
  
    if (!email || password !=cpassword) {
      return next(new ErrorHander("Please Enter Email & Password", 400));
    }
  
    const user = await User.findOne({ email }).select("+password +cpassword");
  
    if (!user) {
      return next(new ErrorHander("Invalid email or password", 401));
    }
    
    const isPasswordMatched = await user.comparePassword(password,cpassword);
    
  
    if (!isPasswordMatched) {
      return next(new ErrorHander("Invalid email or password", 401));
    }
     
    sendToken(user, 200, res);
  });
  exports.downloadPic = catchAsyncErrors(async(req, res) => {
   
    
    // URL of the image
    const id = await QCODE.findById(_id.req.params.id);
    
    const url = "process.env.API+'/public/'+`qrcode/${id}.png`  ";
    
       https.get(url, (res) => {
       const path = `download/${id}.png`;
       const writeStream = fs.createWriteStream(path);
    
       res.pipe(writeStream);
    
       writeStream.on("finish", () => {
          writeStream.close();
          console.log("Download Completed!");
   
           
          
       })
    })
  
   
  });
