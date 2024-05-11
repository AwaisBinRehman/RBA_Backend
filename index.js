const express = require("express");
const cors = require('cors')
const app = express();
const cookieParser = require("cookie-parser");
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

app.use(cors({ origin: '*' }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const User = require('./models/user');
const nodemailer = require("nodemailer");
// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/config.env" });
}


// / / Require the package
//  user Registeration
const userRoutes = require('./routes/user');
// product Routes
const productRoutes = require('./routes/product');
//  Pdf Routes
const pdfRoutes = require('./routes/pdf');
// download pic
const downloadRoutes = require('./routes/download');
// insert qr code
const qrRoutes = require('./routes/insertqr');
// QR code create
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


// Math.floor(1000 + Math.random()*9000)
// console.log(val);

// async function displayGoodMorning() {

// // Display "Good morning" every 5 minutes
//   const task = cron.schedule('*/1 * * * *', () => {
//     console.log('Good morning',moment().format('DD MMM YYYY hr:mm:ss'));
  
   
//   });

//   task.start();
// }



// displayGoodMorning();
// Middleware for Errors
app.use(errorMiddleware);