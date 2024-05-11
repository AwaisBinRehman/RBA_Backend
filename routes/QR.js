const express = require('express');
const QCODE = require('../models/QR');

const { addNewQr, getAllQR, getSingleQR, deleteQR, qrCounts, updateQR } = require('../controller/QR');
const router = express.Router();

router.post('/add/qrcode', addNewQr);
router.delete('/delete/qrcode/:id', deleteQR);
router.get('/getall/qrcode/:id', getAllQR);
router.get('/count/qrcode', qrCounts);
router.get('/single/qrcode/:id', getSingleQR);
router.put('/update/qrcode/:id', updateQR);
router.get('/link/:id', (req, res) => {
  console.log(req.params.id)

  QCODE.findOne({ linkId: req.params.id })
    .exec((error, data) => {
      if (!data) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });                    // <- redirect
        res.write("Looked everywhere, but couldn't find that page at all!\n"); // <- content!
        return res.end();

      }
      const redirectUrl = data.targeted_Url;
      console.log(data)
      return res.writeHead(302,
        { Location: redirectUrl }
      ).end();
    });
});


module.exports = router;