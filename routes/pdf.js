const express=require('express');
const mongoose=require('mongoose');
const { createPdf } = require('../controller/pdf');


const router=express.Router();


 // create PDF
router.get('/add/pdf',createPdf);

module.exports=router;