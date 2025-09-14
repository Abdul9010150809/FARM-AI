const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/predictions', require('./routes/predictions'));
app.use('/api/crops', require('./routes/crops'));
app.use('/api/weather', require('./routes/weather'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cropyield', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log(err));

// Schedule daily model retraining (3 AM daily)
cron.schedule('0 3 * * *', () => {
  console.log('Retraining ML models...');
  // You can call your Python training script here
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));