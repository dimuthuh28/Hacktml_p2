const express = require('express');
const router = express.Router();
const { getTournamentSummary } = require('../controllers/tournamentController');
const { isAdmin } = require('../middleware/authMiddleware');

// Admin Route to get tournament summary, with admin check
router.get('/summary', isAdmin, getTournamentSummary);

module.exports = router;
