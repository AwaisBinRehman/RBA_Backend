const Signature = require("../models/signature");
const ErrorHander = require("../utils/Errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const path=require('path');
const fs=require('fs');
// Create new Order
exports.addsignature = catchAsyncErrors(async (req, res, next) => {
  const MAX_PROFILE_PIC_SIZE = 1024 * 1024; // Maximum allowed size in bytes (e.g., 1MB)
  if (!req.file) {
    return res.status(400).json({ error: 'Profile picture is required' });
  }

  // Assuming the uploaded file is stored in req.file
  // Check the file size before saving
  if (req.file.size > MAX_PROFILE_PIC_SIZE) {
    return res.status(400).json({ error: 'Profile picture size exceeds the limit' });
  }

  const { filename } = req.file; // Extract the filename from req.file

  const signatureCount = await Signature.countDocuments();
  const maxSignatureLimit = 1;

  if (signatureCount >= maxSignatureLimit) {
    return res.status(400).json({ message: 'Maximum signature limit is 1' });
  }

  const existingSignature = await Signature.findOne({ signature: filename }); // Check if the signature already exists
  if (existingSignature) {
    return res.status(400).json({ message: 'Signature already exists' });
  }

  const createdSignature = await Signature.create({
    signature: filename, // Assign the filename to the signature field
  });

  res.status(201).json({
    status: 200,
    signature: createdSignature.signature,
  });
});


exports.getsignature = (req, res) => {
  Signature.find({}, { _id: 1, signature: 1 })
    .exec((error, signatures) => {
      if (error) return res.status(400).json({ error });
      res.status(200).json(signatures);
    });
};



exports.deletesignature = catchAsyncErrors(async (req, res, next) => {
  const signatureId = req.params.id;

  // Find the signature by id
  const signature = await Signature.findById(signatureId);

  if (!signature) {
    return res.status(404).json({ message: 'Signature not found' });
  }

  // Delete the signature file from the file system
  const filePath = path.join(path.dirname(__dirname), 'uploads', 'signature', signature.signature);
  fs.unlinkSync(filePath);

  // Remove the signature from the database
  await signature.remove();

  res.status(200).json({
    status: 200,
    message: 'Signature deleted successfully',
  });
});



exports.updatesignature = async (req, res) => {
  const { id } = req.params;

  try {
    const existingSignature = await Signature.findById(id);
    if (!existingSignature) {
      return res.status(404).json({ message: 'Signature not found' });
    }

    // Delete the existing signature file
    const filePath = path.join(path.dirname(__dirname), 'uploads', 'signature', existingSignature.signature);
    fs.unlinkSync(filePath);

    // Update the signature field with the new filename
    const { filename } = req.file;
    existingSignature.signature = filename;

    const updatedSignature = await existingSignature.save();

    res.status(200).json(updatedSignature);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
