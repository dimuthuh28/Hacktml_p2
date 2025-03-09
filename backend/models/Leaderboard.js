const mongoose = require('mongoose');

// Leaderboard Schema
const leaderboardSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',  // Reference to the Player model
    required: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',  // Reference to the Team model
    required: true
  },
  totalRuns: {
    type: Number,
    default: 0
  },
  totalWickets: {
    type: Number,
    default: 0
  },
  battingAverage: {
    type: Number,
    default: 0
  },
  bowlingAverage: {
    type: Number,
    default: 0
  },
  strikeRate: {
    type: Number,
    default: 0
  },
  economyRate: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
}, { timestamps: true });

module.exports =  mongoose.model('Leaderboard', leaderboardSchema);
