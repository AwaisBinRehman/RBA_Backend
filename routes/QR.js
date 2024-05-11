const express = require("express");
const QCODE = require("../models/QR");
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const {
  addNewQr,
  getAllQR,
  getSingleQR,
  deleteQR,
  qrCounts,
  updateQR,
} = require("../controller/QR");
const router = express.Router();

router.post("/add/qrcode",isAuthenticatedUser, addNewQr);
router.delete("/delete/qrcode/:id", isAuthenticatedUser,deleteQR);
router.get("/getall/qrcode/:id",isAuthenticatedUser, getAllQR);
router.get("/count/qrcode",isAuthenticatedUser, qrCounts);
router.get("/single/qrcode/:id",isAuthenticatedUser, getSingleQR);
router.put("/update/qrcode/:id",isAuthenticatedUser, updateQR);

router.get("/link/:id", (req, res) => {
  QCODE.findOne({ linkId: req.params.id }).exec((error, data) => {
    if (!data) {
      res.writeHead(404, { "Content-Type": "text/plain" }); // <- redirect
      res.write("Looked everywhere, but couldn't find that page at all!\n"); // <- content!
      return res.end();
    }
    const redirectUrl = data.targeted_Url;
    console.log(data);
    return res.writeHead(302, { Location: redirectUrl }).end();
  });
});

module.exports = router;
