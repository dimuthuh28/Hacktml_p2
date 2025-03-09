const express = require('express');
const router = express.Router();
const { getAllPlayers, getPlayerById, addPlayer, updatePlayer, deletePlayer, updatePlayerStats } = require('../controllers/playerController');

// Routes
router.get('/', getAllPlayers);
router.get('/:id', getPlayerById);
router.post('/addPlayer', addPlayer);
router.put('/updatePlayer/:id', updatePlayer); // Update player
router.delete('/deletePlayer/:id', deletePlayer); // Delete player
router.put('/playerstate/:id', updatePlayerStats); // Update player stats

module.exports = router;
