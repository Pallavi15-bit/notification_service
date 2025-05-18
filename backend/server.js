const { app, connectDB } = require('./app');
const config = require('./config');
const kafkaService = require('./services/kafkaService');
const notificationProcessor = require('./services/notificationProcessor');
const retryService = require('./services/retryService');
const logger = require('./utils/logger');

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Initialize Kafka
    await kafkaService.initKafka();
    
    // Start consuming notifications
    await kafkaService.consumeNotifications(notificationProcessor.processNotification);
    
    // Start retry service
    retryService.startRetryService();
    
    // Start the server
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
    
    // Handle graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down server...');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };
    
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
