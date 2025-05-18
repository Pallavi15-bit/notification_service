const twilio = require('twilio');
const config = require('../config');
const logger = require('../utils/logger');

// Initialize Twilio client
const client = twilio(
  config.sms.accountSid,
  config.sms.authToken
);


  // In your smsService.js file
const sendSMS = async (to, content) => {
  try {
    const message = await client.messages.create({
      body: content,
      to: to,
      from: config.sms.phoneNumber  // Add this line with your Twilio phone number
    });
    
    logger.info(`SMS sent: ${message.sid}`);
    return { success: true, messageId: message.sid };
  } catch (error) {
    logger.error('Failed to send SMS', error);
    return { success: false, error: error.message };
  }
};


module.exports = {
  sendSMS
};
