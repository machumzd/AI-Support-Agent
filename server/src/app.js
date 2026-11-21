const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { apiLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(helmet());
app.use(morgan(config.isProd ? 'combined' : 'dev'));

// Allow requests from client or local dev
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === config.clientUrl || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(apiLimiter);

app.get('/', (req, res) => {
  res.json({
    message: 'AI Customer Support Agent API is running',
    status: 'healthy',
    endpoints: {
      health: '/health',
      auth: ['/auth/signup', '/auth/login', '/auth/me'],
      chat: ['/chat/send', '/chat/history']
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
