const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const { username, password, country } = req.body;
  try {
    const user = new User({ username, password, role: 'Employee', country });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Seed HR account (run once manually or automate on startup)
const seedHR = async () => {
  const hrExists = await User.findOne({ username: 'admin' });
  if (!hrExists) {
    const hr = new User({ username: 'admin', password: 'admin', role: 'HR', country: 'US' });
    await hr.save();
    console.log('HR account created');
  }
};
seedHR();