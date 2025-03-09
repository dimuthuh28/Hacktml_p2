const express = require('express');
const router = express.Router();
const { selectTeam, getTeam, getLeaderboard } = require('../controllers/teamController');

router.post('/select-team', selectTeam);
router.get('/team/:userId', getTeam);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
