const nodemailer = require("nodemailer");

const sendEmail = async (infoUser) => {

  const {
    name,
    email
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
    to: `${email}`, // list of receivers
    subject: `${name}, Thanks for Joining TCR Builders!`,
    //text: "Hello world?", // plain text body
    html: `
        <div width='100%' style="font-family:'Montserrat', sans-serif;padding:30px">
  <div style="text-align:center">
    <img
         src="https://res.cloudinary.com/targetool/image/upload/v1612288752/TCR-Builders/images/logos/TCR-Builders-Logo_qxhhke.png"
         alt="logo" width="200"
         />
  </div>
  <div width='100%'>
    <h1 style="text-align:center;color:#333;margin-bottom:30px">Thanks for joining TCR Builders, ${name}!</h1>
    <p style="color:#333;margin-bottom:20px">
      Your request has already been received by our team. In the next hour one of our representatives will be calling you to talk about your project. Remember that you can also see the status of your project as well as make appointments from your account, by entering the following link:
    </p>
    <div style="margin-bottom:40px">
      <a href="http://new.tcrbuilders.com/client-dashboard" style="display:block;text-align:center;background-color:#ea6326;padding:10px;max-width:150px;margin:auto;color:#fff;text-transform:uppercase;text-decoration:none;border-radius: 10px;">My Account</a>
    </div>
  </div>
  <div>
    <h3 style="text-align:center;color:#333">
      Your provisional password is:
    </h3>
    <div style="max-width:200px;margin:auto;">
      <span style="text-align:center;display:block;background-color:#f1f1f1;padding:20px;font-size:30px;border-radius: 10px;">12345678</span>
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

module.exports = sendEmail;