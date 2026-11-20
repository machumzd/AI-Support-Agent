const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    if (config.isProd) {
      process.exit(1);
    }
  }
};

module.exports = { connectDB };
