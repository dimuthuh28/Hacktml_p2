const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    }],
    totalMatches: {
        type: Number,
        default: 0
    },
    totalPlayers: {
        type: Number,
        default: 0
    },
    totalRuns: {
        type: Number,
        default: 0
    },
    totalWickets: {
        type: Number,
        default: 0
    },
    totalBallsFaced: {
        type: Number,
        default: 0
    },
    totalOversBowled: {
        type: Number,
        default: 0
    },
    totalRunsConceded: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Tournament', tournamentSchema);
