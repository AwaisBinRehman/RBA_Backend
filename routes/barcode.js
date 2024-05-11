const express=require('express');
const mongoose=require('mongoose');
const { createbarcode } = require('../controller/barcode');




const router=express.Router();


 // create PDF
 router.get('/get/barcode',createbarcode);


module.exports=router;