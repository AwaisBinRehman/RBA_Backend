const Product = require('../models/product.js');
const Qr = require('../controller/insertqr')
const mongoose = require('mongoose');
const slugify = require('slugify');
const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const shortid = require('shortid');
const path = require('path');
const dirpath = path.join(__dirname, 'qrcode');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const QCODE = require('../models/QR');
const user= require('../models/user.js')
const QRCode = require('qrcode'); // Import the 'qrcode' library
const Product = require('your-product-model'); // Import your product model
const shortid = require('shortid'); // Import the 'shortid' library

exports.addProduct = async (req, res, next) => {
  try {
    const logos = req.files['logo'];

    // Create the product data
    const productData = {
      barcode: '',
      product_name: req.body.product_name,
      Model: req.body.Model,
      Manufacturer: req.body.Manufacturer,
      AvgPrice: req.body.AvgPrice,
      CurrencyUnit: req.body.CurrencyUnit,
      specification: req.body.specification,
      Feature: req.body.Feature,
      Description: req.body.Description,
      size: req.body.size,
      brand: req.body.brand,
      type: req.body.type,
      productpicture: req.body.filename,
      logo: logos.map((file) => file.path),
      userId: req.user._id,
    };

    // Save the product to the database
    const product = new Product(productData);
    await product.save();

    // Generate QR code
    const qrPayload = `localhost:4200/products/${product._id}`;
    const qrCodePath = `qrcode/${product._id}.png`;

    // Generate QR code using the 'qrcode' library
    await generateQRCode(qrPayload, qrCodePath);

    // Update the product's barcode field
    product.barcode = `${process.env.API}/public/${qrCodePath}`;
    await product.save();

    res.status(200).json({ data: product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

async function generateQRCode(data, filePath) {
  try {
    const stringData = JSON.stringify(data);
    await QRCode.toFile(filePath, stringData);
  } catch (error) {
    throw new Error("QR code generation failed");
  }
}


exports.getAllProducts = (req, res) => {
  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  Product.find({ userId: req.user.id })
    .exec((error, userProducts) => {
      if (error) {
        return res.status(500).json({ error: "Internal server error" });
      }
      
      res.status(200).json(userProducts);
    });
};




exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const qr = await Product.findById(req.params.id);


  res.status(200).json({
    success: true,
    qr,
  });
})

exports.deleteProduct = async (req, res) => {
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

exports.deleteAllProducts = async (req, res) => {
  Product.deleteMany({}).then(qrdata => {
    if (qrdata) {
      return res.status(200).json({ success: true, message: 'the All Qrcode deleted successfully!' })
    } else {
      return res.status(404).json({ success: false, message: " Qrcode not found!" })
    }

  }).catch(err => {
    return res.status(500).json({ success: false, error: err })
  })
}

exports.getProductCount = catchAsyncErrors(async (req, res, next) => {
  const qrCount = await Product.countDocuments();
  res.status(200).json({
    success: true,
    qrCount,
  });
});


exports.getVendorProducts = (req, res, next) => {
  const vendorId = req.params.vendorId;

  Product.find({ userId: vendorId }, (error, products) => {
    if (error) {
      return res.status(500).json({ error: 'Error fetching products' });
    }

    if (products.length === 0) {
      return res.status(404).json({ error: 'No products found for the specified vendor' });
    }

    return res.status(200).json({ products });
  });
};



exports.updateproduct = (req, res, next) => {
  const productId = req.params.id;

  // Creating the updated data
  let updatedData = {
    product_name: req.body.product_name,
    Model: req.body.Model,
    Manufacturer: req.body.Manufacturer,
    AvgPrice: req.body.AvgPrice,
    CurrencyUnit: req.body.CurrencyUnit,
    specfication: req.body.specfication,
    Feature: req.body.Feature,
    Description: req.body.Description,
    size: req.body.size,
    brand: req.body.brand,
    type: req.body.type,
    productpicture: req.body.filename,
  };

  // Handle the uploaded logo files
  if (req.files && req.files.logo) {
    const logos = req.files.logo.map((file) => {
      return { img: file.filename }; // Store the filename instead of location
    });
    updatedData.logos = logos;
  }

  Product.findByIdAndUpdate(productId, updatedData, { new: true }, (error, updatedProduct) => {
    if (error) {
      console.log("Error occurred while updating product:", error);
      return res.status(400).json({ error });
    }
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json({ data: updatedProduct });
  });
};
