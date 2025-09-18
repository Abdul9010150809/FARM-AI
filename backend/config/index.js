// config/index.js
import dotenv from 'dotenv';
dotenv.config(); // Loads variables from .env file into process.env

const config = {
  port: process.env.PORT || 5001,
  databaseURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;