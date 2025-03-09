const Player = require("../models/Player");

// Get all players
const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ message: "Error fetching players", error });
  }
};

// Get player by ID
const getPlayerById = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Player.findById(id);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Ensure "Undefined" is returned for Bowling Strike Rate if wickets === 0
    const formattedPlayer = {
      ...player.toObject(),
      calculated: {
        ...player.calculated,
        bowlingStrikeRate: player.calculated.bowlingStrikeRate === 0 
          ? "Undefined"  // If no wickets, set "Undefined"
          : player.calculated.bowlingStrikeRate.toFixed(2)
      }
    };

    res.status(200).json(formattedPlayer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching player", error });
  }
};


// Add a new player
const addPlayer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      university,
      category,
      stats
    } = req.body;

    if (!firstName || !lastName || !university || !category) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const newPlayer = new Player({
      firstName,
      lastName,
      university,
      category,
      stats
    });

    await newPlayer.save();
    res.status(201).json({ message: "Player added successfully", player: newPlayer });

  } catch (error) {
    res.status(500).json({ message: "Error adding player", error });
  }
};

// Update player by ID
const updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPlayer = await Player.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json({ message: "Player updated successfully", player: updatedPlayer });
  } catch (error) {
    res.status(500).json({ message: "Error updating player", error });
  }
};

// Delete player by ID
const deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlayer = await Player.findByIdAndDelete(id);

    if (!deletedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting player", error });
  }
};

// Update player stats
const updatePlayerStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, matchesPlayed, totalRuns, ballsFaced, wickets } = req.body;

    // Find the player by ID and update the stats
    const updatedPlayer = await Player.findByIdAndUpdate(
      id,
      {
        category,
        "stats.inningsPlayed": matchesPlayed,
        "stats.totalRuns": totalRuns,
        "stats.ballsFaced": ballsFaced,
        "stats.wickets": wickets,
      },
      { new: true } // Return the updated document
    );

    if (!updatedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json(updatedPlayer);
  } catch (error) {
    console.error("Error updating player stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { getAllPlayers, getPlayerById, addPlayer, updatePlayer, deletePlayer ,updatePlayerStats};
