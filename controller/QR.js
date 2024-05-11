const QCODE = require('../models/QR');
const express = require('express');
const QRCode = require('qrcode');
const shortid = require('shortid');
const path = require('path');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

exports.addNewQr = (req, res) => {
  const { targeted_Url, qr_name, userId } = req.body
  const id = shortid.generate() + qr_name.split(' ')[0]
  // const link = `${req.get('host')}/qr/link/${id}`
  const link = `${req.protocol}://${req.get('host')}/qr/link/${id}`
  let stringdata = link
  try {
  
    QRCode.toString(stringdata)
    const pic = QRCode.toFile(`qrcode/${id}.png`, stringdata);
    if (pic) {
      obj = new QCODE({
        qrImage : process.env.API + '/public/' + `${id}.png`,
        targeted_Url: targeted_Url,
        qr_name: qr_name,
        userId: userId,
        link: link,
        linkId: id
      })
      obj.qrImage = process.env.API + '/public/' + `${id}.png`;
      obj.save((error, data) => {
        if (error) return res.status(400).json({ error });
        return res.status(200).json({ data })
      });
    }

  } catch (error) {
    res.status(400).json({ error })
  }

}

exports.updateQR = async (req, res) => {
  const { targeted_Url, qr_name} = req.body
  if(targeted_Url && qr_name)
  {
    const qr = await QCODE.findOneAndUpdate({ _id: req.params.id }, {
      targeted_Url: targeted_Url,
      qr_name: qr_name
    }, { new: true }
    )
    if (!qr) {
      return res.status(400).send('QR not found')
    }
    return res.status(200).json({ success: true, qr }) 
  }
  return res.status(400).json({error: 'All feilds'}) 

}
 
exports.getAllQR = (req, res) => {
  // return  res.writeHead(301, {
  //   Location: `http://todoist.com`
  // }).end();
  QCODE.find({ userId: req.params.id })
    .exec((error, qrdata) => {
      if (error) return res.status(400).json({ error });
      if (qrdata) {
        const QrList = (qrdata);
        res.status(200).json({ QrList });
      }
    });
}

exports.getSingleQR = catchAsyncErrors(async (req, res) => {
  const qr = await QCODE.findById(req.params.id);
  res.status(200).json({
    success: true,
    qr,
  });
});

exports.deleteQR = async (req, res) => {
  QCODE.findByIdAndDelete(req.params.id).then(qrdata => {
    if (qrdata) {
      return res.status(200).json({ success: true, message: 'the Qrcode deleted successfully!' })
    } else {
      return res.status(404).json({ success: false, message: " Qrcode not found!" })
    }

  }).catch(err => {
    return res.status(500).json({ success: false, error: err })
  })
}

exports.qrCounts = catchAsyncErrors(async (req, res) => {
  return res.writeHead(301,
    {Location: 'http://http://facebook.com'}
  ).end();
 
});