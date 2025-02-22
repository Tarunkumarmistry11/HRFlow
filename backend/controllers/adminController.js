const Resignation = require('../models/Resignation');
const ExitResponse = require('../models/ExitResponse');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

exports.getResignations = async (req, res) => {
  try {
    const resignations = await Resignation.find().populate('employeeId', 'username');
    res.status(200).json({ data: resignations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.concludeResignation = async (req, res) => {
  const { resignationId, approved, lwd } = req.body;
  try {
    const resignation = await Resignation.findById(resignationId);
    if (!resignation) return res.status(404).json({ message: 'Resignation not found' });
    resignation.status = approved ? 'approved' : 'rejected';
    if (approved) resignation.exitDate = lwd;
    await resignation.save();
    const user = await User.findById(resignation.employeeId);
    const subject = approved ? 'Resignation Approved' : 'Resignation Rejected';
    const text = approved ? `Your resignation is approved. Exit date: ${lwd}` : 'Your resignation has been rejected.';
    sendEmail(`${user.username}@example.com`, subject, text); // Adjust email domain as needed
    res.status(200).json({ message: 'Resignation concluded' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExitResponses = async (req, res) => {
  try {
    const responses = await ExitResponse.find().populate('employeeId', 'username');
    res.status(200).json({ data: responses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};