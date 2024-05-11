const express = require('express');
const mongoose = require('mongoose');
const { addProduct, getAllProducts, getSingleProduct,getPublicSearchedProductById, deleteProduct, getProductCount, deleteAllProducts, updateproduct, getVendorProducts, deleteAllProductsdashboard } = require('../controller/product');
const shortid = require('shortid');
const path = require('path');
const multer = require('multer');
const router = express.Router();

// data storage
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(path.dirname(__dirname), 'uploads/product'))
  },
  filename: (req, file, cb) => {
    let filename = `product-${shortid.generate()}-${file.originalname}`;
    req.body.filename = filename;
    cb(null, filename);
  },
});
const upload = multer({ storage});
const Multipleuploads=upload.fields([{ name: 'productpicture' ,minCount: 1},{ name: 'logo', maxCount: 15 }]);
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
router.post('/add/product',isAuthenticatedUser,Multipleuploads,addProduct);
router.delete('/delete/product/:id', isAuthenticatedUser, deleteProduct);
router.delete('/delete/products',isAuthenticatedUser, deleteAllProducts);
router.delete('/delete/products/dasboard', deleteAllProductsdashboard);
router.get('/product/all/',isAuthenticatedUser,getAllProducts);
router.get('/product/vendor/', isAuthenticatedUser, getVendorProducts);
router.get('/count/qr', isAuthenticatedUser,authorizeRoles('admin'),getProductCount);
router.get('/product/single/:id', isAuthenticatedUser, getSingleProduct);
router.get('/product/searched/:id', getPublicSearchedProductById);
router.put('/update/:id', isAuthenticatedUser,upload.single('productpicture'), updateproduct);

module.exports = router;