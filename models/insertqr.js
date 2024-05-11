
const { type } = require('express/lib/response');
const mongoose =require('mongoose');
const qrSchema=new mongoose.Schema({
    
    productPicture:[
        {
          img:{type:String}}
    ],
    
 

},{timestamps:true});
module.exports=mongoose.model('QRcode',qrSchema);


