// utility/leaderboardUtility.js
const Leaderboard = require('../models/Leaderboard');

const updatePlayerStats = async (playerId, runs, wickets, points) => {
  try {
    const leaderboardEntry = await Leaderboard.findOne({ player: playerId });
    
    if (leaderboardEntry) {
      leaderboardEntry.totalRuns += runs;
      leaderboardEntry.totalWickets += wickets;
      leaderboardEntry.points += points;  // Add points based on performance

      // You can add logic to update batting average, bowling average, strike rate, economy rate, etc.

      await leaderboardEntry.save();
    } else {
      const newEntry = new Leaderboard({
        player: playerId,
        totalRuns: runs,
        totalWickets: wickets,
        points: points,
        // Add other stats calculations here
      });

      await newEntry.save();
    }
  } catch (error) {
    console.error('Error updating player stats:', error);
  }
};

module.exports = { updatePlayerStats };
