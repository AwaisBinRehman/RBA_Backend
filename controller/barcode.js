const PDFDocument = require('pdfkit');
const fs = require('fs');
const codes = require('rescode')
const fs = require('fs');

exports.createbarcode = (req, res) => {
    codes.loadModules(['ean8'])
    dataEan8 = codes.create('ean8', '12345678')
    doc.image(dataEan8, 10, 10, {
        fit: [300, 300],
        align: 'center',
        valign: 'center'
      });
    console.log(dataEan8)

  };


