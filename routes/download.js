const express=require('express');
const mongoose=require('mongoose');
const { downloadPic } = require('../controller/download');
   


const router=express.Router();


router.get('/create/download/',downloadPic);

module.exports=router;