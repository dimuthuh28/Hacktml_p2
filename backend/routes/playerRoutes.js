const express = require('express');
const router = express.Router();
const { getAllPlayers, getPlayerById, addPlayer } = require('../controllers/playerController');  

// Route to get all players
router.get('/', getAllPlayers);

// Route to get player by ID
router.get('/:id', getPlayerById);

// Route to add a new player
router.post('/addPlayer', addPlayer);  

module.exports = router;

