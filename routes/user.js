const express=require('express');
const router=express.Router();
const shortid=require ('shortid');
const path =require('path');
const multer = require('multer');
const { adduser, signin,logout, updateuser, meprofile, deleteUser, getuser, emailsend, personalemail} = require('../controller/user');

// data storage
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(path.dirname(__dirname), 'uploads/user'))
  },
  filename: (req, file, cb) => {
    let filename = `user-${shortid.generate()}-${file.originalname}`;
    req.body.filename = filename;
    cb(null, filename);
  },
});
const {  isAuthenticatedUser,authorizeRoles} = require('../middleware/auth');
const upload = multer({ storage});
const Multipleuploads = upload.fields([
  { name: 'upload_profile', maxCount: 1 },
  { name: 'upload_certificate', minCount: 1, maxCount: 15 },
  { name: 'logo', minCount: 1, maxCount: 15 }
]);

  // Certrficates ROUTES
router.post('/add/user',Multipleuploads,adduser);
router.post('/sigin/user',signin);
router.put('/user/update',isAuthenticatedUser,Multipleuploads,updateuser);
router.get('/user/logout',isAuthenticatedUser,logout);
router.get('/user/me',isAuthenticatedUser,meprofile);

router.post('/user/email',authorizeRoles('admin'),personalemail);
router.delete('/del/:id',authorizeRoles('admin'),deleteUser);
router.get('/',isAuthenticatedUser,authorizeRoles('admin'),getuser)
module.exports=router;

