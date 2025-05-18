const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Send a notification
router.post('/notifications', notificationController.sendNotification);

// Get user notifications
router.get('/users/:id/notifications', notificationController.getUserNotifications);

module.exports = router;
