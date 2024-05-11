const Product = require('../models/product.js');
const mongoose = require('mongoose');
const slugify = require('slugify');
const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const shortid = require('shortid');
const path = require('path');
const dirpath = path.join(__dirname, 'qrcode');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

exports.addProduct = (req, res, next) => {
  // Creating the data
  let dataobj = ({

    product_name: req.body.product_name,
    price: req.body.price,
    discount_price: req.body.discount_price,
    description: req.body.description,



  })


  // Converting the data into String format
  let stringdata = JSON.stringify(dataobj)

  // Print the QR code to terminal

  QRCode.toString(stringdata, { type: 'terminal' },
    function (err, QRcode) {

      if (err) return console.log("error occurred")

      // Printing the generated code
      console.log(QRcode)
    })
  { }
  // Converting the data into base64
  // QRCode.toDataURL(stringdata, async (err,url)=> {
  //   const base64Data=url.replace(/^data:image\/png;base64,/, "");
  //   await fs.writeFile("./public/qrcode/"+data+".png", base64Data, 
  //   base64', (err) => {
  //     console.log(err);
  // });
  const id = shortid.generate();
  QRCode.toFile(`qrcode/${id}.png`, stringdata);

  if (QRCode) {
    dataobj.qrcode = process.env.API + '/public/' + `${id}.png`;
  }

  const data = new Product(dataobj);
  data.save((error, data) => {
    if (error) return res.status(400).json({ error });
    if (data) {
      return res.status(201).json({ data });
    }
  });
};


exports.getqr = (req, res) => {
  Product.find({})
    .exec((error, qrdata) => {
      if (error) return res.status(400).json({ error });
      if (qrdata) {
        const QrList = (qrdata);
        res.status(200).json({ QrList });
      }

    });
}

exports.singleqr = catchAsyncErrors(async (req, res, next) => {
  const qr = await Product.findById(req.params.id);
  ;

  res.status(200).json({
    success: true,
    qr,
  });
});

exports.deleteqr = async (req, res) => {
  Product.findByIdAndDelete(req.params.id).then(qrdata => {
    if (qrdata) {
      return res.status(200).json({ success: true, message: 'the Qrcode deleted successfully!' })
    } else {
      return res.status(404).json({ success: false, message: " Qrcode not found!" })
    }

  }).catch(err => {
    return res.status(500).json({ success: false, error: err })
  })
}
exports.qrCounts = catchAsyncErrors(async (req, res, next) => {
  const qrCount = await Product.countDocuments();




  res.status(200).json({
    success: true,
    qrCount,
  });
});

exports.updateqr = async (req, res) => {
  const qr = await Product.findOneAndUpdate({ _id: req.params.id }, {

    product_name: req.body.product_name,
    price: req.body.price,
    discount_price: req.body.discount_price,
    description: req.body.description,




  }, { new: true }
  )
  if (!qr) {
    return res.status(400).send('QR not found')
  }
  if (qr) {

    return res.status(404).json({ success: true, qr })

  }
}
