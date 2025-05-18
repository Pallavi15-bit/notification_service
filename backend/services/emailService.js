const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

const sendEmail = async (to, subject, content) => {
  try {
    console.log('Attempting to send email with these credentials:');
    console.log('Host:', config.email.host);
    console.log('Port:', config.email.port);
    console.log('User:', config.email.user);
    console.log('Pass length:', config.email.pass ? config.email.pass.length : 0);
    
    const info = await transporter.sendMail({
      from: `"Notification Service" <${config.email.user}>`,
      to,
      subject,
      html: content
    });
    
    logger.info(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Failed to send email', error);
    console.error('Detailed error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail
};
