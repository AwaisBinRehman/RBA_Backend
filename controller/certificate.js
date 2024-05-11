const Certificate =require ('../models/certificate');
const fs=require('fs')
const  catchAsyncErrors=require('../middleware/catchAsyncErrors');
const path=require('path');
const User =require ('../models/user');

exports.addcertificate = catchAsyncErrors(async (req, res) => {
  const {  
    issuedate,
    title,
    companyname,
    companyaddress,
    licensenumber,
    signature,
    issuingauthority,
    officeaddress,
    usercertificate } = req.body; // Change usercertificate to user

  const logoFilePath = req.file.path;

  try {
    const finduser = await User.findById(usercertificate ); // Change usercertificate to user

    if (!finduser) {
      return res.status(404).json({ error: `User with ID '${user}' not found` });
    }

    const certificate = new Certificate({
      issuedate,
      logo: logoFilePath,
      title,
      companyname,
      companyaddress,
      licensenumber,
      signature,
      issuingauthority,
      officeaddress,
    });

    const savedCertificate = await certificate.save();

    // Assign the saved certificate's _id to the usercertificate field
    finduser.usercertificate = savedCertificate._id;
    await finduser.save();

    return res.status(201).json({ message: `Certificate '${savedCertificate.companyname}' created successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// exports.addcertificate = async (req, res) => {
//   const {  
//     issuedate,
//     title,
//     companyname,
//     companyaddress,
//     licensenumber,
//     signature,
//     issuingauthority,
//     officeaddress,
//     usercertificate } = req.body;

//   try {
//     const finduser = await User.findById(usercertificate);
//     if (!finduser) {
//       return res.status(404).json({ error: `Lesson with ID '${usercertificate}' not found` });
//     }

// // Save the video information (video paths) to the LessonVideo table
//     const certificatedata = new Certificate({
//       data: {
//         issuedate,
//         title,
//         companyname,
//         companyaddress,
//         licensenumber,
//         signature,
//         issuingauthority,
//         officeaddress,
       
//       }
//     });

//     const usercertificate = await certificatedata.save();

//     // Update the Lesson table with the associated video ID
//     finduser.usercertificate.push(usercertificate._id);
//     await finduser.save();

//     return res.status(201).json({ message: `Certificate '${usercertificate.companyname}' created successfully` });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

  

//  GET COLOURS
exports.getcertificate =(req,res)=>{
    Certificate.find({}).populate('signature')
    .exec((error,certificate)=>{
    if(error) return res.status(400).json({error});
    if(certificate){
        const certificateList = (certificate);
        res.status(200).json(certificateList);
    }

    });
}

 
// DELETE Certificate



exports.deletecertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found!' });
    }

    // Remove the certificate, triggering the pre middleware to update user references
    await certificate.remove();

    return res.status(200).json({ success: true, message: 'The certificate is deleted!' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


exports.updatecertificate=async(req,res)=>{
    let new_image='';
    if (req.file){
        new_image=req.file.filename;
        try{
         fs.unlinkSync('uploads/certificate'+req.file.logo);
        }catch(err){
             console.log(err); 
        }
    }else{
       new_image=req.body.logo;
    }
    
    const certifiactedata=await Certificate.findOneAndUpdate({_id:req.params.id},{
     
      issuedate,
      title,
      companyname,
      companyaddress,
      licensenumber,
      signature,
      issuingauthority,
      officeaddress,
     
      
   } = req.body,{new:true}
   )
    
         if(!certifiactedata)
     return res.status(400).send('sorry certifiacte not found')
    
     if(certifiactedata){
         res.send (certifiactedata);
        
 
     }
      }
//      count certificate
exports.certificateCounts = catchAsyncErrors(async (req, res, next) => {
  const certificateCount = await Certificate.countDocuments();


  

  res.status(200).json({
    success: true,
    certificateCount,
  });
});

     
exports.getcertificatebyUser = async (req, res) => {
  try {
        const { userId }= req.params; 
        // Find all lessons that match the given course ID
        const user= await User.find().where({_id :userId  }).populate("usercertificate").exec();
        
        res.status(200).json(user);
     
    
      } catch (error) {
        console.error(error); // Log the error to the console
        return res.status(500).json({ error: 'Internal server error' });
        
      }

};
