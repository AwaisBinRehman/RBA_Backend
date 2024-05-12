const Product = require("../models/product.js");
const Qr = require("../controller/insertqr");
const mongoose = require("mongoose");
const slugify = require("slugify");
const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");
const shortid = require("shortid");
const path = require("path");
const dirpath = path.join(__dirname, "qrcode");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const QCODE = require("../models/QR");
const User = require("../models/user.js");
const user = require("../models/user.js");
// exports.addProduct = (req, res, next) => {
//   const logos = req.files['logo'];
//   let dataobj = {
//     barcode: '',
//     product_name: req.body.product_name,
//     Model: req.body.Model,
//     Manufacturer: req.body.Manufacturer,
//     AvgPrice: req.body.AvgPrice,
//     CurrencyUnit: req.body.CurrencyUnit,
//     specification: req.body.specification,
//     Feature: req.body.Feature,
//     Description: req.body.Description,
//     size: req.body.size,
//     brand: req.body.brand,
//     type: req.body.type,
//     productpicture: req.body.filename,
//     logo: logos.map((file) => file.path),
//     number:req.body.number,
//     userid: req.user.id
//   };

//   const data = new Product(dataobj);
//   data.save((error, savedData) => {
//     if (error) {
//       return res.status(400).json({ error });
//     }

//     // Generate and save QR code
//     generateAndSaveQRCode(savedData._id)
//       .then(() => {
//         res.status(200).json({ data: savedData });
//       })
//       .catch((err) => {
//         return res.status(500).json({ error: err.message });
//       });
//   });
// };
// exports.addProduct = (req, res, next) => {
//   const logos = req.files['logo'];
//   const uniqueIdentifier = req.body.filename;

//   let dataobj = {
//     barcode: '',
//     product_name: req.body.product_name,
//     Model: req.body.Model,
//     Manufacturer: req.body.Manufacturer,
//     AvgPrice: req.body.AvgPrice,
//     CurrencyUnit: req.body.CurrencyUnit,
//     specification: req.body.specification,
//     Feature: req.body.Feature,
//     Description: req.body.Description,
//     size: req.body.size,
//     brand: req.body.brand,
//     type: req.body.type,
//     productpicture: req.body.filename,
//     logo: logos.map((file) =>`${file.filename}`),
//     number: req.body.number,
//     userid: req.user.id
//   };
//   const finduser = await User.findById(userid);
//     if (!findcategory) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
//   const data = new Product(dataobj);
//   finduser.productid.push(dataobj._id);
//   await finduser.save();

//   data.save((error, savedData) => {
//     if (error) {
//       return res.status(400).json({ error });
//     }

//     // Generate and save QR code
//     generateAndSaveQRCode(savedData._id)
//       .then(() => {
//         res.status(200).json({ data: savedData });
//       })
//       .catch((err) => {
//         return res.status(500).json({ error: err.message });
//       });
//   });
// };

exports.addProduct = async (req, res, next) => {
  const logos = req.files["logo"];
    debugger
  let dataobj = {
    barcode: req.body.barcode,
    selectedBarcodeType: req.body.selectedBarcodeType,
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
    logo: logos.map((file) => `${file.filename}`),
    number: req.body.number ?? "",
    userid: req.user.id,
  };

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    const product = new Product(dataobj);
    // Generate and save QR code
    const qrCodeFileName = await generateAndSaveQRCode(product._id, req);
    product.qrCode = qrCodeFileName;

    await product.save();
    user.productid.push(product._id);
    await user.save();
    res.status(200).json({ data: product });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

async function generateAndSaveQRCode(productId, req) {
  return new Promise((resolve, reject) => {
    debugger
    const qrPayload = `http://localhost:4200/searched/${productId}`;
    const id = shortid.generate();
    const qrCodePath = `qrcode/${id}.png`;
    const qrCodeData = JSON.stringify(qrPayload);

    QRCode.toFile(qrCodePath, qrCodeData, (err) => {
      if (err) {
        reject(new Error("QR code generation failed"));
      } else {
        resolve(qrCodePath);
      }
    });
  });
}

exports.getAllProducts = (req, res) => {
  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  Product.find({ userid: req.user.id }).exec((error, userProducts) => {
    if (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json(userProducts);
  });
};

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const qr = await Product.findOne({ _id: req.params.id, userid: req.user.id });
  res.status(200).json({
    success: true,
    qr,
  });
});

exports.getPublicSearchedProductById = catchAsyncErrors(
  async (req, res, next) => {
    try {
      console.log(req.params.id);
      const qr = await Product.findOne({ barcode: req.params.id });
      if (!qr) {
        // If not found by barcode, search by ID
        const productById = await Product.findById(req.params.id);
        if (!productById) {
          return res
            .status(404)
            .json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({ success: true, qr: productById });
      }
      res.status(200).json({ success: true, qr });
    } catch (error) {
      console.error(error);
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
  }
);

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (deletedProduct) {
      // Find the parent user by user ID
      const user = await User.findById(req.user.id);

      if (!user) {
        return res
          .status(404)
          .json({ error: `User with ID '${req.user.id}' not found` });
      }

      // Remove the product ID from the user's productid array
      const index = user.productid.indexOf(req.params.id);
      if (index !== -1) {
        user.productid.splice(index, 1);
        await user.save();
      }

      return res.status(200).json({
        success: true,
        message: "The product and associated data deleted successfully!",
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteAllProductsdashboard = async (req, res) => {
  Product.deleteMany({})
    .then((qrdata) => {
      if (qrdata) {
        return res.status(200).json({
          success: true,
          message: "the All Qrcode deleted successfully!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: " Qrcode not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
};

exports.deleteAllProducts = async (req, res) => {
  const userid = req.user.id;

  try {
    const result = await Product.deleteMany({ userid: userid });

    if (result.deletedCount > 0) {
      return res.status(200).json({
        success: true,
        message: "All products for the specified user deleted successfully!",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No products found for the specified user.",
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getProductCount = catchAsyncErrors(async (req, res, next) => {
  const qrCount = await Product.countDocuments();
  res.status(200).json({
    success: true,
    qrCount,
  });
});

// exports.getVendorProducts = (req, res, next) => {
//   const userid = req.user.id;

//   Product.find({ userid  }, (error, products) => {
//     if (error) {
//       return res.status(500).json({ error: 'Error fetching products' });
//     }

//     if (products.length === 0) {
//       return res.status(404).json({ error: 'No products found for the specified vendor' });
//     }

//     return res.status(200).json({ products });
//   });
// };
exports.getVendorProducts = async (req, res, next) => {
  const userid = req.user.id;

  try {
    const user = await User.findById(userid).populate("productid");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const products = user.productid;

    if (products.length === 0) {
      return res
        .status(404)
        .json({ error: "No products found for the specified vendor" });
    }

    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching products" });
  }
};

exports.updateproduct = async (req, res, next) => {
  const productId = req.params.id;
  const data = JSON.parse(req.body.productData);
  let updatedData = {
    barcode: data.barcode,
    selectedBarcodeType: data.selectedBarcodeType,
    product_name: data.product_name,
    Model: data.Model,
    Manufacturer: data.Manufacturer,
    AvgPrice: data.AvgPrice,
    CurrencyUnit: data.CurrencyUnit,
    specfication: data.specfication,
    Feature: data.Feature,
    qrCode: data.qrCode,
    Description: data.Description,
    size: data.size,
    brand: data.brand,
    type: data.type,
    productpicture: data.productpicture,
    number: data.number,
  };

  if (req.files && req.files.logo) {
    const logos = req.files.logo.map((file) => {
      return { img: file.filename }; 
    });
    updatedData.logos = logos;
  }

  if(!updatedData.qrCode) {
    const qrCodeFileName = await generateAndSaveQRCode(productId, req);
    updatedData.qrCode = qrCodeFileName;
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ data: updatedProduct });
  } catch (error) {
    console.log("Error occurred while updating product:", error);
    res.status(400).json({ error: error.message });
  }
};


