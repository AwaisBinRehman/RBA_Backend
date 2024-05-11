const express=require('express');
const mongoose=require('mongoose');
const shortid = require('shortid');
const path = require('path');
const multer = require('multer');
const { addsignature, getsignature, updatesignature, deletesignature } = require('../controller/signature');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
// data storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '..', 'uploads', 'signature'));
    },
    filename: function (req, file, cb) {
      const filename = `signature-${shortid.generate()}-${file.originalname}`;
      req.body.filename = filename;
      cb(null, filename);
    }
  });
  
  const allowedExtensions = ['.png', '.jpg'];
  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
      const ext = path.extname(file.originalname);
      if (!allowedExtensions.includes(ext.toLowerCase())) {
        return callback(new Error(`Only ${allowedExtensions.join(', ')} files are allowed`));
      }
      callback(null, true);
    },
    limits: {
      fileSize: 1024 * 1024 // 1MB
    }
  }).single('signature');
  
// create PDF
 router.post('/signature',upload,isAuthenticatedUser,authorizeRoles('admin'),addsignature);
 router.get('/signature',getsignature);
 router.put('/signature/:id',upload,isAuthenticatedUser,authorizeRoles('admin'),updatesignature);
 router.delete('/signature/:id',upload,isAuthenticatedUser,authorizeRoles('admin'),deletesignature);
module.exports=router;