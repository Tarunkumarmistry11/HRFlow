const express = require('express');
const { submitResignation, submitExitResponse } = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middleware/auth');
const router = express.Router();

router.post('/resign', verifyToken, checkRole('Employee'), submitResignation);
router.post('/responses', verifyToken, checkRole('Employee'), submitExitResponse);

module.exports = router;