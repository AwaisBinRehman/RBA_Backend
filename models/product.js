const mongoose = require('mongoose');
const Schema = require('mongoose');

const productSchema = new mongoose.Schema({
    barcode: {
        type: String,
    },
    qrCode: {
        type: String,
        required: false
    },
    selectedBarcodeType: {
        type: String,
        required: true
    },
    product_name: {
        type: String,
        required: true,
        min: 12,
        max: 200
    },
    Model: {
        type: String,
        required: true,
        min: 12,
        max: 200
    },
    Manufacturer: {
        type: String,
        required: true,
        min: 12,
        max: 200

    },

    AvgPrice: {
        type: String,
        required: true,
        min: 12,
        max: 200

    },
    CurrencyUnit: {
        type: String,
        required: true,
        min: 12,
        max: 200

    },
    specfication: {
        type: String,
        reuired: true,
        min: 12,
        max: 200

    },
    Feature: {
        type: String,
        required: true,
        min: 12,
        max: 200

    },
    Description: {
        type: String,
        required: true,
        min: 12,
        max: 200
    },
    size:{
    type:String,
    
    },
    brand:{
    type:String,
    required:true
    },
    type:{
     type:String,
     
    },
    productpicture:{
        type: String,
        required: true,
    },
    logo: [{
        type: String,
        
      }],
      number:{
        type: String
    },
    userid: {type: mongoose.Schema.Types.ObjectId,
        ref: 'User', }


}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
});
module.exports = mongoose.model('Product', productSchema);