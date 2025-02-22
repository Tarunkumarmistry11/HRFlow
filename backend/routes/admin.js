const express = require('express');
const { getResignations, concludeResignation, getExitResponses } = require('../controllers/adminController');
const { verifyToken, checkRole } = require('../middleware/auth');
const router = express.Router();

router.get('/resignations', verifyToken, checkRole('HR'), getResignations);
router.put('/conclude_resignation', verifyToken, checkRole('HR'), concludeResignation);
router.get('/exit_responses', verifyToken, checkRole('HR'), getExitResponses);

module.exports = router;