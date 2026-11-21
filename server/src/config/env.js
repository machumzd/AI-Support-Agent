const dotenv = require('dotenv');

dotenv.config();

const env = process.env.NODE_ENV || 'development';

module.exports = {
  env,
  isProd: env === 'production',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/support_chat_db',
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_key_12345',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  ai: {
    provider: process.env.AI_PROVIDER || 'openrouter',
    openrouterApiKey: process.env.OPENROUTER_API_KEY || '',
    openrouterModel: process.env.OPENROUTER_MODEL || 'openrouter/free',
    hfApiKey: process.env.HUGGINGFACE_API_KEY || '',
    hfModel: process.env.HUGGINGFACE_MODEL || 'facebook/blenderbot-400M-distill'
  },

  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    authMax: 20,
    chatMax: parseInt(process.env.CHAT_RATE_LIMIT_MAX_REQUESTS, 10) || 30
  }
};
