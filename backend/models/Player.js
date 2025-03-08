const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },

  university: {
    type: String,
    required: true,
    enum: [
      'University of Colombo',
      'University of Peradeniya',
      'University of Moratuwa',
      'University of Ruhuna',
      'University of Jaffna',
      'University of Visual and Performing Arts',
      'University of Sri Jayawardanapura',
      'Eastern University',
      'South Eastern University',
      'University of Kelaniya'
    ]
  },
  category: {
    type: String,
    required: true,
    enum: ['Batsman', 'All-Rounder', 'Bowler']
  },
  stats: {
    totalRuns: { type: Number, default: 0 },
    ballsFaced: { type: Number, default: 0 },
    inningsPlayed: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    oversBowled: { type: Number, default: 0 },
    runsConceded: { type: Number, default: 0 }
  },
  calculated: {
    battingStrikeRate: { type: Number, default: 0 },
    battingAverage: { type: Number, default: 0 },
    bowlingStrikeRate: { type: Number, default: 0 },
    economyRate: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    value: { type: Number, default: 0 }
  }
}, { timestamps: true });

//  Calculate player statistics.
// Calculate player statistics.
playerSchema.methods.calculateStats = function() {
  const ballsBowled = this.stats.oversBowled * 6;

  // Batting Stats Calculation
  this.calculated.battingStrikeRate = this.stats.ballsFaced > 0
      ? Number(((this.stats.totalRuns / this.stats.ballsFaced) * 100).toFixed(2))
      : 0;

  this.calculated.battingAverage = this.stats.inningsPlayed > 0
      ? Number((this.stats.totalRuns / this.stats.inningsPlayed).toFixed(2))
      : 0;

  // Bowling Stats Calculation (Handle 0 wickets case)
  if (this.stats.wickets > 0) {
      this.calculated.bowlingStrikeRate = Number((ballsBowled / this.stats.wickets).toFixed(2));
      this.calculated.economyRate = ballsBowled > 0
          ? Number(((this.stats.runsConceded / ballsBowled) * 6).toFixed(2))
          : 0;
  } else {
      this.calculated.bowlingStrikeRate = 0;
      this.calculated.economyRate = 0;
  }

  // Points Calculation
  let battingPoints = (this.calculated.battingStrikeRate / 5) + (this.calculated.battingAverage * 0.8);
  let bowlingPoints = 0;

  // If the player has no wickets, apply only batting points
  if (this.stats.wickets > 0) {
      // Bowling points calculation if wickets are greater than 0
      if (this.calculated.bowlingStrikeRate === 0 && this.calculated.economyRate === 0) {
          bowlingPoints = 0;
      } else if (this.calculated.bowlingStrikeRate === 0) {
          bowlingPoints = 140 / this.calculated.economyRate;
      } else {
          bowlingPoints = (500 / this.calculated.bowlingStrikeRate) + (140 / this.calculated.economyRate);
      }
  }

  // Calculate total points, ensure it's a valid number
  this.calculated.points = Number((battingPoints + bowlingPoints).toFixed(2));

  // If points are invalid (NaN or 0), set them to 0
  if (isNaN(this.calculated.points) || this.calculated.points < 0) {
      this.calculated.points = 0;
  }

  // Value Calculation (round to nearest 50,000)
  if (this.calculated.points > 0) {
      this.calculated.value = Math.round((9 * this.calculated.points + 100) * 1000 / 50000) * 50000;
  } else {
      this.calculated.value = 0; // Set value to 0 if points are 0 or less
  }
};

// Middleware to calculate stats before saving.
playerSchema.pre('save', function(next) {
  if (this.isModified('stats')) {
    this.calculateStats();  
  }
  next();
});

const Player = mongoose.model('Player', playerSchema);
module.exports = Player;
