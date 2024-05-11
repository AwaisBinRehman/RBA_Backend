const express=require('express');
// const { requireSignin, adminMiddleware,userMiddleware } = require('../common-middleware');

const { createProduct,
  updateProduct,
  
  deleteProduct ,
  productsCounts,
  getProductDetailsById,
  getAdminProducts

  
  } = require('../controller/insertqr');
const multer = require('multer');
// some middle ware to upload the file
const mongoose=require('mongoose');
const router=express.Router();
const shortid=require ('shortid');
const path =require('path');
const product = require('../models/product');
const { get } = require('express/lib/response');




// data storage
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//   const upload =multer({dest:'uploads/'});
  
  const upload = multer({ storage});

  
    //  create product
router.post('/product/create',upload.array('productPicture'),createProduct);

// update product
router.put('/product/admin/update/:id',upload.array('productPicture'),updateProduct);

// deleteProduct 
router.delete('/product/delete/:id',deleteProduct);


// get product Detail

router.get("/productdetail/:id", getProductDetailsById); 
router.get("/product/count",productsCounts);

router.get('/products',getAdminProducts);



 
module.exports=router;  