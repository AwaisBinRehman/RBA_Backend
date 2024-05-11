const https = require("https");
const fs = require("fs");
const Product = require('../models/product.js');
const QCODE = require('../models/QR');
const download = require('download');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
exports.downloadPic = catchAsyncErrors(async (req, res) => {

  // URL of the image
  // const id = await QCODE.findById(req.params.id);
  const file = "localhost:3000/public/kWm5mX0JXb-abdullah uni.jpg";
  // const file = "localhost:3000/public/`qrcode/${id}.png`";

  // Path to store the downloaded file
  const filePath = `${__dirname}/download`;

  download(file, filePath)
    .then(() => {
      console.log('File downloaded successfully!');
    })



});


