const express=require('express');
const router=express.Router();
const shortid=require ('shortid');
const path =require('path');
const multer = require('multer');
const { addcertificate,
   getcertificate,
   certificateCounts,
    deletecertificate, 
    updatecertificate,
    getcertificatebyUser} = require('../controller/certificate');

// data storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname),'uploads/certificate'));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname)
  },
});
const upload = multer({ storage});
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
  // Certrficates ROUTES
router.post('/certificate', isAuthenticatedUser,authorizeRoles('admin'),upload.single('logo'),addcertificate);
router.get('/certificate', isAuthenticatedUser,authorizeRoles('admin'),getcertificate);
router.put('/certificate/:id',upload.single('logo'),updatecertificate);
router.delete('/certificate/:id', isAuthenticatedUser,authorizeRoles('admin'),deletecertificate)
router.get('/certificate/user/:userId', isAuthenticatedUser,getcertificatebyUser);
module.exports=router;

