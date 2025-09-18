// config/db.js
import mongoose from 'mongoose';
import config from './index.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.databaseURI);
    console.log(`MongoDB Connected: ${conn.connection.host} ✅`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message} ❌`);
    process.exit(1); // Exit process with failure if DB connection fails
  }
};

export default connectDB;