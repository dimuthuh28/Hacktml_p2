const Team = require('../models/Team');
const Player = require('../models/Player');
const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');

exports.selectTeam = async (req, res) => {
  try {
    const { userId, playerIds } = req.body;

    // Check if the user already has a team
    const existingTeam = await Team.findOne({ userId });
    if (existingTeam) {
      return res.status(400).json({ message: "You have already created a team. Changes are not allowed!" });
    }

    // Fetch selected players
    const players = await Player.find({ _id: { $in: playerIds } });

    // Validate exactly 11 players
    if (playerIds.length !== 11) {
      return res.status(400).json({ message: "You must select exactly 11 players." });
    }

    // Calculate total cost
    const totalCost = players.reduce((sum, player) => sum + player.calculated.value, 0);
    if (totalCost > 9000000) {
      return res.status(400).json({ message: "Budget exceeded!" });
    }

    // Calculate total team points
    const totalPoints = players.reduce((sum, player) => sum + (player.points || 0), 0);

    // Create and save the team
    const team = new Team({
      userId,
      selectedPlayers: playerIds,
      remainingBudget: 9000000 - totalCost
    });

    await team.save();

    // Add to leaderboard
    await Leaderboard.create({
      team: team._id,
      points: totalPoints
    });

    res.status(201).json({ message: "Team created successfully!", team });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Fetch user's team
exports.getTeam = async (req, res) => {
  try {
    const { userId } = req.params;

    const team = await Team.findOne({ userId }).populate('selectedPlayers');

    if (!team) {
      return res.status(404).json({ message: "Team not found!" });
    }

    res.json({ team });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get leaderboard (ranked by team points)
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find()
      .sort({ points: -1 }) // Sort by highest points first
      .populate({
        path: 'team',
        populate: { path: 'userId', select: 'username' } // Get the user (team creator) name
      });

    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      user: entry.team.userId.username, // User who created the team
      points: entry.points
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
