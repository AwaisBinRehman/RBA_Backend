const mongoose = require("mongoose");
const ErrorHander = require("../utils/Errorhandler");
const User = require("../models/user");
const sendToken = require("../utils/JwtToken");
const slugify = require("slugify");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const user = require("../models/user");
const TempUser = require("../models/tempuser");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const Email = require("../models/singleemail");

exports.adduser = async (req, res, next) => {
  try {
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
    } = req.body;

    const uploadProfile = req.files["upload_profile"][0];
    const uploadCertificates = req.files["upload_certificate"];
    const logos = req.files["logo"];

    if (uploadProfile && uploadCertificates && logos) {
      const UserObj = {
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
        upload_profile: uploadProfile.path,
        upload_certificate: uploadCertificates.map((file) => file.path),
        logo: logos.map((file) => file.path),
      };

      const _user = new User(UserObj);
      await _user.save();
      res.json({ message: "User registered successfully." });
    } else {
      res.status(400).json({ message: "Files are missing." });
    }
    console.log(req.body);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving user details." });
  }
};

// User and Admin signin
exports.signin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHander("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select(
    "+password cpassword email applicant_Name"
  );
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
  debugger;
  const _id = req.user.id;
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
  };
  updates.logo = req.body.existing_logos
  updates.upload_certificate = req.body.existing_certificates

  if (req.files && Object.keys(req.files).length > 0) {
    const uploadProfile = req.files.upload_profile ?? null;
    const uploadCertificates = req.files.upload_certificate ?? null;
    const logos = req.files.logo ?? mull;

    if (uploadProfile) {
      updates.upload_profile = uploadProfile.filename;
    }

    if (uploadCertificates) {
      const existingCertificates = req.body.existing_certificates || [];
      const newCertificates = uploadCertificates.map((file) => file.filename);
      updates.upload_certificate = [
        ...existingCertificates,
        ...newCertificates,
      ];
    }

    if (logos) {
      const existingLogos = req.body.existing_logos || [];
      const newLogos = logos.map((file) => file.filename);
      updates.logo = [...existingLogos, ...newLogos];
    }
  }

  try {
    const post = await User.findOneAndUpdate(
      { _id: _id },
      { $set: updates },
      { new: true }
    );
    res.status(200).json({ message: "updated sucessfully", updates });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Unable to edit article" });
  }
});

exports.meprofile = catchAsyncErrors(async (req, res, next) => {
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
exports.getuser = (req, res) => {
  User.find({}).exec((error, users) => {
    if (error) return res.status(400).json({ error });
    if (users) {
      const userList = users;
      res.status(200).json(userList);
    }
  });
};

// Email send
exports.emailsend = catchAsyncErrors(async (req, res, next) => {
  cron.schedule("2 * * * * *", async () => {
    try {
      // Retrieve all registered users from the database
      const users = await User.find();

      // Send email to each user
      for (const user of users) {
        // Use a nodemailer configuration to send emails
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          service: "gmail",
          auth: {
            user: "roboticworldtest@gmail.com",
            pass: "qcbwcjmmdsipxqun",
          },
        });

        const mailOptions = {
          from: "noshabakhan767@gmail.com",
          to: user.email,
          subject: "Welcome!",
          text: "Learn as if hbjk8ui90you will live forever, live like you will die tomorrow",
        };

        await transporter.sendMail(mailOptions);
      }

      console.log("Emails sent successfully.");
    } catch (error) {
      console.error("Error sending emails", error);
    }
  });
});
exports.personalemail = catchAsyncErrors(async (req, res, next) => {
  const { recipient, subject, body } = req.body;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: "Gmail",
    auth: {
      user: "roboticworldtest@gmail.com",
      pass: "qcbwcjmmdsipxqun",
    },
  });
  const email = new Email({
    recipient: recipient,
    subject: subject,
    body: body,
  });
  // Save the email document to MongoDB
  email.save();

  const mailOptions = {
    from: "noshabakhan767@gmail.com",
    to: recipient,
    subject: subject,
    text: body,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(400).json({ message: "Email sent" });
    } else {
      res.status(200).json({ message: "Email sent:" });
    }
    console.log(error);
  });
});
