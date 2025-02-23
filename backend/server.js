const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Enable CORS
app.use(express.json());

// Function to seed HR account
const seedHR = async () => {
  try {
    const User = require('./models/User'); // Adjust the path to your User model
    const hrExists = await User.findOne({ username: 'admin' });
    if (!hrExists) {
      const hr = new User({ username: 'admin', password: 'admin', role: 'HR', country: 'US' });
      await hr.save();
      console.log('HR account created');
    } else {
      console.log('HR account already exists');
    }
  } catch (error) {
    console.error('Error seeding HR account:', error);
  }
};

// Connect to MongoDB and start the server only after connection
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
    // Run seeding function after connection is established
    await seedHR();
    
    // Start the server
    app.listen(8080, () => {
      console.log('Server running on port 8080');
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if connection fails
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);