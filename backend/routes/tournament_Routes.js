const express = require('express');

const {
     getAllTournaments, 
     createTournament, 
     getTournamentSummary } = require('../controllers/tournamentController_');

const router = express.Router();

router.get('/', getAllTournaments);
router.post('/', createTournament);
router.get('/summary', getTournamentSummary);

module.exports = router;
