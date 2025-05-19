const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');
const logger = require('./utils/logger');
const path = require('path');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API Routes
app.use('/', notificationRoutes);
app.use('/', userRoutes);

// Serve frontend for any other routes - fix the wildcard route
app.get('/:path(*)', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/add-user.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection error', error);
    process.exit(1);
  }
};

module.exports = { app, connectDB };
