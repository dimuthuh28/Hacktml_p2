// routes/leaderboardRoutes.js
const express = require('express');
const router = express.Router();
const { getLeaderboard, updatePlayerStatsController,updateMatchStats } = require('../controllers/leaderboardController');

// Route to get leaderboard (for users to view)
router.get('/', getLeaderboard);

router.post('/updateMatchStats', updateMatchStats); 

// Route to update player stats (called after a match or performance update)
router.post('/updateStats', updatePlayerStatsController);



module.exports = router;





