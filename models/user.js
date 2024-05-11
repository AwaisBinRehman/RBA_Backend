const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(

  {
    btitle: {
      type: String,
      required: true,
      trim: true,

    },
    slugify: {
      type: String
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    office_Address: {
      type: String,
      required: true,
    },
    applicant_Name: {
      type: String,
      required: true
    },
    applicant_fName: {
      type: String,
      required: true
    },
    contact_Number: {
      type: String,
      required: true
    },
    applicant_Designation: {
      type: String,
      required: true,
    },
    applicant_MotherName: {
      type: String,
      required: true,
    },
    applicant_Birthplace: {
      type: String,
      required: true,
    },
    Individual_Business_Partnership: {
      type: String,
      required: true,
    },
    
    upload_profile: {
      type: String,
      required: true,
    
    },
    upload_certificate: [{
      type: String,
      required: true
    }],
    logo: [{
      type: String,
      required: true
    }],
  
    email: {
      type: String,
      required: true,
      
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    cpassword: {
      type: String,
      required: true,
      select: false
    },
   
    role: {
      type: String,
      enum:['admin','user'],
      default:'user',
    },
    usercertificate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate'
  },
  productid: [ { type:mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    otp: { type: String },
    otpExpiration: { type: Date },
    verified:Boolean,
    resetotp: String,
    resetotpExpiration: Date,

  },
 

  { timestamps: true ,
    toJSON:{ 
      virtuals:true
    },
    toObject:{ 
        virtuals:true
    },
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("cpassword")) {
    next();
  }
  this.cpassword = await bcrypt.hash(this.cpassword, 10);
});
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.comparePassword = async function (cpassword) {
  return await bcrypt.compare(cpassword, this.cpassword);
};
// generateJwtToken
// Generate Jwt Token
userSchema.methods.generateJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      // applicant_Name: this.applicant_Name,
      email: this.email,
      role: this.role // Include the role property here
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};


// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
