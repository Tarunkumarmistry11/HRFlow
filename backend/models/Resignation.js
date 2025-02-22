const mongoose = require('mongoose');

const resignationSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  intendedLwd: { type: String, required: true },
  reason: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  exitDate: { type: String }
});

module.exports = mongoose.model('Resignation', resignationSchema);