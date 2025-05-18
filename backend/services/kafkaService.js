const { Kafka } = require('kafkajs');
const config = require('../config');
const logger = require('../utils/logger');

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: config.kafka.brokers
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'notification-group' });

const NOTIFICATION_TOPIC = 'notifications';

const initKafka = async () => {
  try {
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({ topic: NOTIFICATION_TOPIC, fromBeginning: false });
    
    logger.info('Kafka connection established');
  } catch (error) {
    logger.error('Failed to connect to Kafka', error);
    throw error;
  }
};

const sendNotification = async (notification) => {
  try {
    await producer.send({
      topic: NOTIFICATION_TOPIC,
      messages: [
        { 
          key: notification.type, 
          value: JSON.stringify(notification) 
        }
      ]
    });
    
    logger.info(`Notification queued: ${notification._id}`);
    return true;
  } catch (error) {
    logger.error('Failed to queue notification', error);
    return false;
  }
};

const consumeNotifications = async (messageHandler) => {
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const notification = JSON.parse(message.value.toString());
        await messageHandler(notification);
      } catch (error) {
        logger.error('Error processing notification', error);
      }
    }
  });
};

module.exports = {
  initKafka,
  sendNotification,
  consumeNotifications
};
