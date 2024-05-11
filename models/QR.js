const mongoose = require('mongoose');
const Schema = require('mongoose');

const qrSchema = new mongoose.Schema({

    targeted_Url: {
        type: String,
        required: true,
    },
    qrImage: {
        type: String,
    },
    qr_name: {
        type: String,
        required: true,
        
    },
    link: {
        type: String,
        required: true,
        
    },
    linkId: {
        type: String,
        required: true,
        unique: true
        
    },

    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
module.exports = mongoose.model('QCODE', qrSchema);