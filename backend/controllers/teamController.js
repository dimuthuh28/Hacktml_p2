const Team = require('../models/Team');
const Player = require('../models/Player');

// Select players for the team
exports.selectTeam = async (req, res) => {
  try {
    const { userId, playerIds } = req.body;

    // Fetch selected players
    const players = await Player.find({ _id: { $in: playerIds } });

    // Calculate total cost
    const totalCost = players.reduce((sum, player) => sum + player.calculated.value, 0);

    if (totalCost > 9000000) {
      return res.status(400).json({ message: "Budget exceeded!" });
    }

    // Check if exactly 11 players are selected
    if (playerIds.length !== 11) {
      return res.status(400).json({ message: "You must select exactly 11 players." });
    }

    // Save the team or update if the team exists
    const team = await Team.findOneAndUpdate(
      { userId },
      { selectedPlayers: playerIds, remainingBudget: 9000000 - totalCost },
      { upsert: true, new: true }
    );

    res.json({ message: "Team selected successfully!", team });
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

// Update the team budget when a player is added or removed
exports.updateBudget = async (req, res) => {
  try {
    const { userId, playerId, action } = req.body; // action: 'add' or 'remove'

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found!" });
    }

    const team = await Team.findOne({ userId });
    if (!team) {
      return res.status(404).json({ message: "Team not found!" });
    }

    let newBudget;
    if (action === 'add') {
      newBudget = team.remainingBudget - player.calculated.value;
    } else if (action === 'remove') {
      newBudget = team.remainingBudget + player.calculated.value;
    } else {
      return res.status(400).json({ message: "Invalid action!" });
    }

    // If the budget is exceeded
    if (newBudget < 0) {
      return res.status(400).json({ message: "Budget exceeded!" });
    }

    // Update the team with the new budget
    team.remainingBudget = newBudget;
    await team.save();

    res.json({ message: "Budget updated successfully!", team });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
