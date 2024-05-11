const QRcode = require('../models/insertqr');
const shortid = require('shortid');
const slugify = require('slugify');
const bodyParser = require('body-parser');
const product = require('../models/product');
const fs = require('fs');
const APIFeatures = require('../middleware/Apifeatures');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

class Producti {
  // Delete Image from uploads -> products folder
  static deleteImages(images, mode) {
    var basePath = path.resolve(__dirname + "") + "upload";
    console.log(basePath);
    for (var i = 0; i < images.length; i++) {
      let filePath = "";
      if (mode == "file") {
        filePath = basePath + `${images[i].filename}`;
      } else {
        filePath = basePath + `${images[i]}`;
      }
      console.log(filePath);
      if (fs.existsSync(filePath)) {
        console.log("Exists image");
      }
      fs.unlink(filePath, (err) => {
        if (err) {
          return err;
        }
      });
    }
  }
}

exports.createProduct = (req, res) => {

  let { files } = req;
  let productPicture = [];

  if (req.files.length > 0) {
    productPicture = req.files.map((file) => {
      return { img: file.path };
    });
  }
  const product = new QRcode({

    productPicture,


  });

  product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(201).json({ product, files: req.files });
    }
    console.log(req.body);
  });
};
// Get all products

// // UPDATE Product
exports.updateProduct = catchAsyncErrors(async (req, res) => {
  let { body, files } = req;
  let product = await QRcode.findById(req.params.id);
  if (!product) return res.status(404).send("No Product Found");

  let productPicture = [];
  files.map(async (file) => {
    productPicture.push({ img: file.path });
  });
  let data = {};
  if (files.length > 0) {
    data = {
      ...body,
      productPicture: [...productPicture],
    };
  } else {
    data = { ...body };
  }
  return res.send({ productPicture, ...body });
  let updatedProduct = await Product.findOneAndUpdate(req.params.id, { ...body, productPicture: [...productPicture] });
  return res.send({ updatedProduct });
});


// Get product Details
exports.getProductDetailsById = catchAsyncErrors(async (req, res, next) => {
  const product = await QRcode.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found!" })
  }

  res.status(200).json({
    success: true,
    product,
  });
});
// Get product count
exports.productsCounts = catchAsyncErrors(async (req, res, next) => {
  const productsCount = await QRcode.countDocuments();
  res.status(200).json({
    success: true,
    productsCount,
  });
});







exports.deleteProduct = async (req, res) => {
  QRcode.findByIdAndDelete(req.params.id).then(product => {
    if (product) {
      return res.status(200).json({ success: true, message: 'the Product is deleted!' })
    } else {
      return res.status(404).json({ success: false, message: "Product not found!" })
    }
  }).catch(err => {
    return res.status(500).json({ success: false, error: err })
  })
}


exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 5;

  const apifeatures = new APIFeatures(QRcode.find(), req.query)
    .search()
    .filter();
  const products = await apifeatures.query;
  let filteredProductsCount = products.length;
  res.status(200).json({
    success: true,
    count: products.length,
    filteredProductsCount,
    resultPerPage,
    products
  })
});


