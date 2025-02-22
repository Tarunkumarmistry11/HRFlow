const mongoose = require('mongoose');

const exitResponseSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  responses: [{ questionText: String, response: String }]
});

module.exports = mongoose.model('ExitResponse', exitResponseSchema);