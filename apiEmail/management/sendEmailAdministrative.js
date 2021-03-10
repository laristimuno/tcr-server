const nodemailer = require("nodemailer");

const sendEmailAdministrative = async (infoUser) => {

  const {
    name,
    lastName,
    email,
    phoneNumber,
    project,
    projectType,
    financing,
    streetAddress,
    city,
    state,
    zipCode
  } = infoUser;

  let transporter = nodemailer.createTransport({
    host: "mail.tcrbuilders.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.NOREPLAYEMAIL, // generated ethereal user
      pass: process.env.NOREPLAYPASS, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"TCR Builders" <noreply@tcrbuilders.com>',
    to: 'laristimuno@gmail.com, ciaraba01@gmail.com', // list of receivers
    subject: `New lead was registered - ${name} ${lastName}`,
    //text: "Hello world?", // plain text body
    html: `<div width='100%' style="font-family:'Montserrat', sans-serif;padding:30px">
        <div style="text-align:center">
          <img
               src="https://res.cloudinary.com/targetool/image/upload/v1612288752/TCR-Builders/images/logos/TCR-Builders-Logo_qxhhke.png"
               alt="logo" width="200"
               />
        </div>
        <div width='100%'>
          <h1 style="text-align:center;color:#333;margin-bottom:30px">Client ${name} ${lastName} has joined TCR Builders</h1>
      
          <h3 style="margin:5px 0px;padding:0px">Name:<span style="margin-left:10px;color:#8a8a8a">${name} ${lastName}</span></h3>
      
          <h3 style="margin:5px 0px;padding:0px">Email:<span style="margin-left:10px;color:#8a8a8a">${email}</span></h3>
          
          <h3 style="margin:5px 0px;padding:0px">Phone Number:<span style="margin-left:10px;color:#8a8a8a">${phoneNumber}</span></h3> 
      
          <h3 style="margin:5px 0px;padding:0px">Project:<span style="margin-left:10px;color:#8a8a8a">${project}</span></h3> 
      
          <h3 style="margin:5px 0px;padding:0px">Project Type:<span style="margin-left:10px;color:#8a8a8a">${projectType}</span></h3>  
      
          <h3 style="margin:5px 0px;padding:0px">financing:<span style="margin-left:10px;color:#8a8a8a">${financing}</span></h3>  
      
          <h3 style="margin:5px 0px;padding:0px">streetAddress:<span style="margin-left:10px;color:#8a8a8a">${streetAddress}</span></h3>  
      
          <h3 style="margin:5px 0px;padding:0px">city:<span style="margin-left:10px;color:#8a8a8a">${city}</span></h3>  
      
          <h3 style="margin:5px 0px;padding:0px">state:<span style="margin-left:10px;color:#8a8a8a">${state}</span></h3>  
      
          <h3 style="margin:5px 0px;padding:0px">zipCode:<span style="margin-left:10px;color:#8a8a8a">${zipCode}</span></h3>  
      
          <p style="color:#333;margin-bottom:20px">
            To manage this client you must enter the administrative account:
      
          </p>
          <div style="margin-bottom:40px">
            <a href="http://localhost:3000/client-dashboard" style="display:block;text-align:center;background-color:#ea6326;padding:10px;max-width:250px;margin:auto;color:#fff;text-transform:uppercase;text-decoration:none;border-radius: 10px;">Administrative panel</a>
          </div>
        </div>
      </div>`,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // send mail with defined transport object
  transporter.sendMail(info, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    done();
  });




}

module.exports = sendEmailAdministrative;