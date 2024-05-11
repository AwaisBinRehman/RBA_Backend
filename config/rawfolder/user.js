const mongoose = require('mongoose');
const ErrorHander = require("../utils/Errorhandler");
const User = require('../models/user');
const sendToken = require("../utils/JwtToken");
const slugify = require('slugify');
const express = require('express');
const router = express.Router();
const fs = require('fs')
const user = require('../models/user');
const TempUser=require('../models/tempuser');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const nodemailer = require("nodemailer");
exports.adduser = catchAsyncErrors(async (req, res,next) => {
const otp=`${Math.floor(10000 + Math.random()*90000).toString()}`;
  const expirationTime = new Date().getTime() + 5  * 60 * 1000;
  const {
    btitle,
    slug,
    country,
    office_Address,
    applicant_Name,
    applicant_fName,
    contact_Number,
    applicant_Designation,
    applicant_MotherName,
    applicant_Birthplace,
    Individual_Business_Partnership,
    email,
    password,
    cpassword,
    
    
 
  }=req.body;
 
  if (req.files && req.body.filename) {
    upload_profile = req.body.filename;
    upload_certificate= req.body.filename;

  } 
  if (req.body.password !== req.body.cpassword) {
    console.log(UserObj.password +"and cpass"+UserObj.cpassword);

    return res.status(400).json({
      message: "Password does not match",
    });
  }
  
  const user= new TempUser({ email, otp,otpExpiration: expirationTime,upload_profile,upload_certificate });
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

});

  exports.verifyotp = catchAsyncErrors(async (req, res) => {

  const tempuser = await TempUser.findOne({email: req.body.email,otp: req.body.otp});
  if (!tempuser) {
    res.status(500).json({ message: 'Invalid OTP.' });
    console.log(otp);
  }
  
  else {
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
        email: tempuser.email,
        password: req.body.password,
        cpassword: req.body.cpassword,
        verified:true,
       
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
      const user= new User(UserObj)
      user.save(function(err) {
        if (err) {
          console.log(err);
          res.status(500).json({ message: 'Error saving user details.' });
        } else {
          res.json({ message: 'User registered successfully.' });
        }
        
      });
      
      TempUser.deleteOne({ email: req.body.email, otp: req.body.otp }, function(err) {
        if (err) {
          console.log(err);
        }
      });
    }
});
// User and Admin signin
exports.signin = catchAsyncErrors(async (req, res, next) => {
  const { email, password} = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHander("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password cpassword email applicant_Name");
  // const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);


  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
exports.updateuser = catchAsyncErrors(async (req, res) => {
  const _id=req.user.id;
  const updates = {
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
     

  }
  if (req.files && req.body.filename) {
    updates.upload_profile = req.body.filename;
    updates.upload_certificate= req.body.filename;

  }

   await User.findOneAndUpdate(_id, {
          $set: updates
      }, {
          new: true
      }).then(post => {
        res.status(200).json({message:'updated sucessfully',updates});
      })
      .catch(err => {
          return('Unable to edit article');
      });

  
});
exports.meprofile= catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//  delete usere
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  
  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

// get all users
exports.getuser =(req,res)=>{
  User.find({})
  .exec((error,users)=>{
  if(error) return res.status(400).json({error});
  if(users){
      const userList = (users);
      res.status(200).json(userList);
  }

  });
}
