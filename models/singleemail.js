
const { type } = require('express/lib/response');
const mongoose =require('mongoose');
const emailSchema=new mongoose.Schema({

    recipient:{type:String,
        required: true,
    },
    subject:{type:String,
        required: true,
    },
    body:{type:String,
        required: true,}
    
 

},{timestamps:true});
module.exports=mongoose.model('Email',emailSchema);


