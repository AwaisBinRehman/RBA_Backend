const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  issuedate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        const currentDate = new Date();
        return value <= currentDate; // Issue date can be today or in the past
      },
      message: 'Issue date must be today or in the past',
    },
  },

  issueYear: {
    type: Number,
    default: new Date().getFullYear(),
  },

  logo: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  companyname: {
    type: String,
    required: true,
  },

  companyaddress: {
    type: String,
    required: true,
  },

  licensenumber: {
    type: String,
    validate: {
      validator: function (value) {
        // Regular expression for license number validation
        const licenseNumberRegex = /^[A-Za-z0-9]{6}$/;
        return licenseNumberRegex.test(value);
      },
      message: 'Invalid license number',
    },
  },

  signature: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Signature', // Replace 'Signature' with the actual name of your signature model
    required: true,
  },

  issuingauthority: {
    type: String,
    default: "issuing Authority pakistan",
  },

  officeaddress: {
    type: String,
  },


}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
``
