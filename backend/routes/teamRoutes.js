const express = require('express');
const router = express.Router();
const { selectTeam, getTeam, updateBudget } = require('../controllers/teamController');

// Route to select players and create the team
router.post('/select', selectTeam);

// Route to get the user's team details
router.get('/:userId', getTeam);

// Route to update the budget when adding/removing players
router.post('/update-budget', updateBudget);

module.exports = router;
