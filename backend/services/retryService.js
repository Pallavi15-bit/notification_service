// services/retryService.js
const Notification = require('../models/notification');
const kafkaService = require('./kafkaService');
const logger = require('../utils/logger');

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5 * 60 * 1000; // 5 minutes

const startRetryService = () => {
  setInterval(async () => {
    try {
      // Find failed notifications that haven't exceeded max retries
      const cutoffTime = new Date(Date.now() - RETRY_INTERVAL);
      
      const notifications = await Notification.find({
        status: 'failed',
        retryCount: { $lt: MAX_RETRIES },
        $or: [
          { lastRetryAt: { $lt: cutoffTime } },
          { lastRetryAt: { $exists: false } }
        ]
      });
      
      logger.info(`Found ${notifications.length} failed notifications to retry`);
      
      for (const notification of notifications) {
        notification.status = 'pending';
        await notification.save();
        
        // Re-queue for processing
        await kafkaService.sendNotification(notification);
        logger.info(`Re-queued notification: ${notification._id}`);
      }
    } catch (error) {
      logger.error('Error in retry service', error);
    }
  }, RETRY_INTERVAL);
  
  logger.info('Retry service started');
};

module.exports = {
  startRetryService
};
