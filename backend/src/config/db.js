const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/complaint_management', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Please check if MongoDB service is running or check MONGODB_URI in your .env file.');
    // We do not crash the app, so developers can see error messages or run in fallback modes if needed
    process.exit(1);
  }
};

module.exports = connectDB;
