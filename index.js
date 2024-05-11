const express = require("express");
const cors = require('cors')
const app = express();
const cookieParser = require("cookie-parser");
const fs = require('fs');
const bodyParser = require("body-parser");
const multer = require('multer');
const upload = multer();
const path = require("path");
const connectDatabase = require("./config/db");
const errorMiddleware = require("./middleware/error");
const cron = require('node-cron');
app.use('/uploads', express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/qrcode', express.static('qrcode'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const User = require('./models/user');
const nodemailer = require("nodemailer");
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/config.env" });
}
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const pdfRoutes = require('./routes/pdf');
const downloadRoutes = require('./routes/download');
const qrRoutes = require('./routes/insertqr');
const qrcodeRoutes = require('./routes/QR')
const certificateRoutes = require('./routes/certificate')
const signatureRoutes = require('./routes/signature')

app.use(cors({
  credentials: true,
  origin: '*',
}));

app.get('/', (req, res) => {
  res.send("Apis of right brand asia working.");
});


app.get('/download-qrcode/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, 'qrcode', fileName);
  if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
  }
  const fileStream = fs.createReadStream(filePath);
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  fileStream.pipe(res);
});

app.use('/qr', userRoutes);
app.use('/qr', productRoutes);
app.use('/qr', pdfRoutes);
app.use('/qr', downloadRoutes);
app.use('/qr', qrRoutes);
app.use('/qr', qrcodeRoutes);
app.use('/qr', certificateRoutes);
app.use('/qr', signatureRoutes);



connectDatabase();
app.listen(process.env.PORT, () => {
  console.log(`Server is running perfect on Port http:localhost: ${process.env.PORT}`);
});

app.use(errorMiddleware);