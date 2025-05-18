// services/notificationProcessor.js
const Notification = require('../models/notification');
const User = require('../models/user');
const emailService = require('./emailService');
const smsService = require('./smsService');
const inAppService = require('./inAppService');
const logger = require('../utils/logger');

const MAX_RETRIES = 3;

const processNotification = async (notification) => {
  try {
    // Fetch the notification from the database to get the latest status
    const dbNotification = await Notification.findById(notification._id);
    if (!dbNotification) {
      logger.error(`Notification not found: ${notification._id}`);
      return;
    }
    
    // Skip if already sent or delivered
    if (['sent', 'delivered'].includes(dbNotification.status)) {
      logger.info(`Notification ${dbNotification._id} already processed, skipping`);
      return;
    }
    
    // Fetch user
    const user = await User.findById(dbNotification.userId);
    if (!user) {
      logger.error(`User not found for notification: ${dbNotification._id}`);
      dbNotification.status = 'failed';
      dbNotification.metadata.error = 'User not found';
      await dbNotification.save();
      return;
    }
    
    let result;
    
    // Process based on notification type
    switch (dbNotification.type) {
      case 'email':
        if (!user.email) {
          dbNotification.status = 'failed';
          dbNotification.metadata.error = 'User has no email address';
          await dbNotification.save();
          return;
        }
        result = await emailService.sendEmail(user.email, dbNotification.title, dbNotification.content);
        break;
        
      case 'sms':
        if (!user.phone) {
          dbNotification.status = 'failed';
          dbNotification.metadata.error = 'User has no phone number';
          await dbNotification.save();
          return;
        }
        result = await smsService.sendSMS(user.phone, dbNotification.content);
        break;
        
      case 'in-app':
        result = await inAppService.sendInAppNotification(user._id, dbNotification.title, dbNotification.content);
        break;
        
      default:
        logger.error(`Unsupported notification type: ${dbNotification.type}`);
        dbNotification.status = 'failed';
        dbNotification.metadata.error = 'Unsupported notification type';
        await dbNotification.save();
        return;
    }
    
    // Update notification status based on result
    if (result.success) {
      dbNotification.status = dbNotification.type === 'in-app' ? 'delivered' : 'sent';
      dbNotification.metadata.messageId = result.messageId;
    } else {
      dbNotification.retryCount += 1;
      dbNotification.lastRetryAt = new Date();
      
      if (dbNotification.retryCount >= MAX_RETRIES) {
        dbNotification.status = 'failed';
        dbNotification.metadata.error = result.error;
      } else {
        dbNotification.status = 'pending';
        dbNotification.metadata.lastError = result.error;
      }
    }
    
    await dbNotification.save();
    logger.info(`Notification ${dbNotification._id} processed with status: ${dbNotification.status}`);
  } catch (error) {
    logger.error('Error processing notification', error);
  }
};

module.exports = {
  processNotification
};
