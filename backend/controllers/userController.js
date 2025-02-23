const Resignation = require('../models/Resignation');
const ExitResponse = require('../models/ExitResponse');
const User = require('../models/User');
const axios = require('axios');
const moment = require('moment');

exports.submitResignation = async (req, res) => {
  const { lwd } = req.body;
  const employeeId = req.user.id;
  try {
    const user = await User.findById(employeeId);const Resignation = require('../models/Resignation');
    const ExitResponse = require('../models/ExitResponse');
    const User = require('../models/User');
    const axios = require('axios');
    const moment = require('moment');
    const { resignationValidation, exitResponseValidation } = require('../validation/resignationValidation');
    
    exports.submitResignation = async (req, res) => {
      const { error } = resignationValidation(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });
    
      const { lwd } = req.body;
      const employeeId = req.user.id;
      try {
        const user = await User.findById(employeeId);
        const year = moment(lwd).year();
        const holidays = await getHolidays(user.country, year);
        const isHoliday = holidays.includes(lwd);
        const isWeekend = moment(lwd).day() === 0 || moment(lwd).day() === 6;
        if (isHoliday || isWeekend) {
          return res.status(400).json({ message: 'Last working day cannot be a weekend or holiday' });
        }
        const resignation = new Resignation({ employeeId, intendedLwd: lwd });
        await resignation.save();
        res.status(200).json({ data: { resignation: { _id: resignation._id } } });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    
    async function getHolidays(country, year) {
      try {
        const response = await axios.get('https://calendarific.com/api/v2/holidays', {
          params: { api_key: process.env.CALENDARIFIC_API_KEY, country, year }
        });
        return response.data.response.holidays.map(h => h.date.iso);
      } catch (error) {
        console.error('Calendarific API error:', error.message);
        return [];
      }
    }
    
    exports.submitExitResponse = async (req, res) => {
      const { error } = exitResponseValidation(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });
    
      const { responses } = req.body;
      const employeeId = req.user.id;
      try {
        const resignation = await Resignation.findOne({ employeeId, status: 'approved' });
        if (!resignation) return res.status(403).json({ message: 'No approved resignation found' });
        const exitResponse = new ExitResponse({ employeeId, responses });
        await exitResponse.save();
        res.status(200).json({ message: 'Exit interview submitted' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    
    const year = moment(lwd).year();
    const holidays = await getHolidays(user.country, year);
    const isHoliday = holidays.includes(lwd);
    const isWeekend = moment(lwd).day() === 0 || moment(lwd).day() === 6;
    if (isHoliday || isWeekend) {
      return res.status(400).json({ message: 'Last working day cannot be a weekend or holiday' });
    }
    const resignation = new Resignation({ employeeId, intendedLwd: lwd });
    await resignation.save();
    res.status(200).json({ data: { resignation: { _id: resignation._id } } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function getHolidays(country, year) {
  try {
    const response = await axios.get('https://calendarific.com/api/v2/holidays', {
      params: { api_key: process.env.CALENDARIFIC_API_KEY, country, year }
    });
    return response.data.response.holidays.map(h => h.date.iso);
  } catch (error) {
    console.error('Calendarific API error:', error.message);
    return []; 
  }
}

exports.submitExitResponse = async (req, res) => {
  const { responses } = req.body;
  const employeeId = req.user.id;
  try {
    const resignation = await Resignation.findOne({ employeeId, status: 'approved' });
    if (!resignation) return res.status(403).json({ message: 'No approved resignation found' });
    const exitResponse = new ExitResponse({ employeeId, responses });
    await exitResponse.save();
    res.status(200).json({ message: 'Exit interview submitted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};