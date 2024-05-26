
module.exports = {
    host: process.env.MAIL_HOST || 'smtp.example.com', // Replace with your SMTP server
    port: process.env.MAIL_PORT || 587,
    auth: {
        user: process.env.MAIL_USER || 'your-email@example.com',
        pass: process.env.MAIL_PASS || 'your-email-password'
    }
};
