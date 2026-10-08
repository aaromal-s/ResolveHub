const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/complaint_management', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Connection Warning: ${error.message}`);
    console.warn('Backend server running. If local MongoDB is not running, configure MONGODB_URI in backend/.env to connect to your MongoDB cluster.');
  }
};

module.exports = connectDB;
