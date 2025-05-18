# notification_service
# Notification System

A robust, scalable notification service that supports multiple communication channels including email, SMS, and in-app notifications.

## Features

- **Multi-channel Notifications**: Send notifications via email, SMS, and in-app channels
- **Template System**: Create and manage reusable notification templates with variable substitution
- **Scheduled Notifications**: Schedule notifications to be sent at a future time
- **User Preferences**: Respect user communication preferences
- **Message Queue**: Reliable message delivery with retry mechanism
- **Real-time Dashboard**: Monitor notification status and delivery metrics
- **RESTful API**: Well-documented API for easy integration

## Technology Stack

### Backend
- **Node.js & Express**: Fast, unopinionated web framework
- **MongoDB**: Flexible NoSQL database for storing users, notifications, and templates
- **Kafka/RabbitMQ**: Message queue for asynchronous processing
- **Nodemailer**: For sending email notifications
- **Twilio**: For sending SMS notifications

### Frontend
- **React**: Component-based UI library
- **React Router**: For navigation and routing
- **Vite**: Next-generation frontend tooling

### DevOps
- **Docker**: Containerization for consistent environments
- **Jest**: Testing framework for unit and integration tests

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- Docker (optional)

### Installation

#### Using Docker (Recommended)
```bash
# Clone the repository
git clone https://github.com/yourusername/notification-system.git
cd notification-system

# Start all services
docker-compose up -d
```

#### Manual Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/notification-system.git
cd notification-system

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the application
npm run dev
```

## Usage

### Creating a Notification Template

Templates allow you to define reusable notification content with placeholders for dynamic data.

```javascript
// Example API call to create an email template
const response = await fetch('/api/notification/v3/template/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    templatesetName: "WelcomeEmail",
    templateParam: [{
      paramName: "Name",
      defaultValue: "User",
      placeHolderName: "name",
      paramTypeId: 4
    }],
    templateChannelAndFile: [{
      communicationChannel: 1, // Email
      fileName: "welcome.html"
    }]
  })
});
```

### Sending a Notification

```javascript
// Example API call to send a notification
const response = await fetch('/api/notifications/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    templateId: 123,
    recipients: ["user@example.com"],
    data: {
      name: "John Doe",
      url: "https://example.com/verify"
    },
    channel: "email",
    priority: "high"
  })
});
```

## Notification Types

| Level | Description | Use Case |
|-------|-------------|----------|
| success | Positive confirmation | Task completion, successful operation |
| error | Critical issue | Failed operations, system errors |
| warning | Potential issue | Low disk space, approaching limits |
| info | General information | System updates, new features |

## Configuration

The notification system can be configured through environment variables:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/notification-system

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user
SMTP_PASS=password

# SMS Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Queue Configuration
QUEUE_PROVIDER=kafka
KAFKA_BROKERS=localhost:9092
```

## API Documentation

Our REST API is documented using Swagger. After starting the application, visit:
```
http://localhost:3000/api-docs
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

