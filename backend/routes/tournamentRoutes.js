const express = require('express');
const router = express.Router();
const { getTournamentSummary } = require('../controllers/tournamentController');
const { isAdmin } = require('../middleware/authMiddleware');

// Admin-only route to get tournament summary
router.get('/summary', isAdmin, getTournamentSummary);

module.exports = router;
