const mongoose = require('mongoose');
const signatureSchema = new mongoose.Schema({
    signature: { type: String, 
        required: true
    },
    
  
});
  
 module.exports = mongoose.model('Signature',signatureSchema);

 