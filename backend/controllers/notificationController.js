const Notification = require('../models/notification');
const User = require('../models/user');
const kafkaService = require('../services/kafkaService');
const logger = require('../utils/logger');

// Send a notification
const sendNotification = async (req, res) => {
  try {
    const { userId, type, title, content } = req.body;
    
    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check user preferences
    if (type === 'email' && !user.preferences.email) {
      return res.status(400).json({ 
        success: false, 
        message: 'User has disabled email notifications' 
      });
    }

    if (type === 'sms' && !user.preferences.sms) {
      return res.status(400).json({ 
        success: false, 
        message: 'User has disabled SMS notifications' 
      });
    }

    if (type === 'in-app' && !user.preferences.inApp) {
      return res.status(400).json({ 
        success: false, 
        message: 'User has disabled in-app notifications' 
      });
    }
    
    // Create notification record
    const notification = new Notification({
      userId,
      type,
      title,
      content,
      status: 'pending'
    });
    
    await notification.save();
    
    // Send to Kafka queue
    const queued = await kafkaService.sendNotification(notification);
    
    if (queued) {
      return res.status(202).json({
        success: true,
        message: 'Notification queued successfully',
        notificationId: notification._id
      });
    } else {
      notification.status = 'failed';
      await notification.save();
      
      return res.status(500).json({
        success: false,
        message: 'Failed to queue notification'
      });
    }
  } catch (error) {
    logger.error('Error in sendNotification', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get notifications for user
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(100);
    
    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    logger.error('Error in getUserNotifications', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  sendNotification,
  getUserNotifications
};
