// backend/utils/jwt.js
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: '30d', // The token will expire in 30 days
  });
};

export default generateToken;