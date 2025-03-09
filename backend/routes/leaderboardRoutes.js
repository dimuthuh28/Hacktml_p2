const express = require('express');
const router = express.Router();
const { getTeamLeaderboard } = require('../controllers/leaderboardController');

// Define the leaderboard route
router.get('/leaderboard', getTeamLeaderboard);

module.exports = router;
