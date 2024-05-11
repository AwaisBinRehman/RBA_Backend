const nodemailer = require("nodemailer");
const env =require ('dotenv');
const sendEmail = async () => {
  let transporter = await nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
     auth: {
          user: 'roboticworldtest@gmail.com',
          pass: 'qcbwcjmmdsipxqun',
        },
    
  });


  

  await transporter.sendMail(function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendEmail;
