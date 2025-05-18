const Notification = require('../models/notification');
const logger = require('../utils/logger');

// In a real application, this would use WebSockets or a similar technology
const sendInAppNotification = async (userId, title, content) => {
  try {
    // Store the notification in the database with 'delivered' status
    // In a real app, this would also push to connected WebSocket clients
    const notification = new Notification({
      userId,
      type: 'in-app',
      title,
      content,
      status: 'delivered'
    });
    
    await notification.save();
    logger.info(`In-app notification created: ${notification._id}`);
    return { success: true, notificationId: notification._id };
  } catch (error) {
    logger.error('Failed to create in-app notification', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendInAppNotification
};
