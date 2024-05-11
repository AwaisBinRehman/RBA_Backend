const PDFDocument = require('pdfkit');
const fs = require('fs');
const Product =require ('../models/product.js');
exports.createPdf = (req, res) => {
  // Create a document
const doc = new PDFDocument();
// See below for browser usage
doc.pipe(fs.createWriteStream(req.param.id));
// Adding functionality
doc
   
  .fontSize(27)

  
// Adding an image in the pdf.
  
  doc.image(`qrcode/${id}.png`, {
    fit: [300, 300],
    align: 'center',
    valign: 'center'
  });
  
  
   
  
// Finalize PDF file
doc.end();
   
  };


