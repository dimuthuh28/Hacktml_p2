const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  selectedPlayers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  remainingBudget: {
    type: Number,
    default: 9000000
  }
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
