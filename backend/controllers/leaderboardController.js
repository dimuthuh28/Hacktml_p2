const Leaderboard = require('../models/Leaderboard');
const Player = require('../models/Player');
const { updatePlayerStats } = require('../utils/leaderboardUtility');

// Get the leaderboard (sorted by points or relevant stats)
exports.getLeaderboard = async (req, res) => {
  try {
    // Fetch players and their stats, sorted by points (descending)
    const leaderboard = await Leaderboard.find()
      .populate('player', 'name')  // Populate player details (name)
      .populate('team', 'name')  // Populate team details (name)
      .sort({ points: -1 })  // Sort leaderboard by points (or you can use total runs, wickets, etc.)
      .limit(10);  // Get top 10 players

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateMatchStats = async (req, res) => {
  const { playerId, runs, wickets, points } = req.body;

  try {
    await updatePlayerStats(playerId, runs, wickets, points);  // Call the utility function
    res.status(200).json({ message: 'Player stats updated successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to update player stats' });
  }
};

// Controller to handle updating player stats
const updatePlayerStatsController = async (req, res) => {
  try {
    const { playerId, runs, wickets, points } = req.body;
    
    // Call the utility function to update player stats
    await updatePlayerStats(playerId, runs, wickets, points);
    
    res.status(200).json({ message: 'Player stats updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating player stats', error });
  }
};
