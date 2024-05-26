
const nodemailer = require('nodemailer');
const mailConfig = require('../config/mail');

const transporter = nodemailer.createTransport(mailConfig);

const sendMail = async (to, subject, text, html) => {
    const mailOptions = {
        from: mailConfig.auth.user,
        to,
        subject,
        text,
        html
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendMail
};
