const nodeMailer = require('nodemailer');

const sendEmail = async options => {
    //1. create transporter:
         const transporter = nodeMailer.createTransport({

            host: 'smtp.mailtrap.io',
            port: 25,
             //secure: true, 
            auth: {
                 user: '744846e9b51dcc',
                 pass: '35dd0f5f835c37'
             }
         })

    //2. Define the email Options:
         const mailOptions = {
             from: 'Nik Ydv <noreply.tskMgr@gmail.com>',
             to: options.email,
             subject: options.subject,
             html: options.message
         }

    //3. Actually send email:
        await transporter.sendMail(mailOptions);

};

module.exports = sendEmail;
