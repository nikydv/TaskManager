const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  //1. create transporter:
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 25,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2. Define the email Options:
  const mailOptions = {
    from: "Nik Ydv <noreply.tskMgr@gmail.com>",
    to: options.email,
    subject: options.subject,
    html: options.message,
  };
  //3. Actually send email:
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
