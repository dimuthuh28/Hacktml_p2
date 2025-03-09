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

// Update Player Stats
// Update Player Stats
const updatePlayerStats = async (req, res) => {
  const { id } = req.params; // Using id from the URL params
  const {
    totalRuns,
    ballsFaced,
    inningsPlayed,
    wickets,
    oversBowled,
    runsConceded,
    category
  } = req.body;

  try {
    // Find the player by ID
    const player = await Player.findById(id);

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Update category if provided
    if (category !== undefined) {
      player.category = category;
    }

    // Update the stats only if new values are provided
    if (totalRuns !== undefined) player.stats.totalRuns = totalRuns;
    if (ballsFaced !== undefined) player.stats.ballsFaced = ballsFaced;
    if (inningsPlayed !== undefined) player.stats.inningsPlayed = inningsPlayed;
    if (wickets !== undefined) player.stats.wickets = wickets;
    if (oversBowled !== undefined) player.stats.oversBowled = oversBowled;
    if (runsConceded !== undefined) player.stats.runsConceded = runsConceded;

    // Mark stats as modified to ensure the pre-save hook runs
    player.markModified('stats');
    
    // Save the updated player stats - this will trigger the calculateStats() method
    await player.save();

    // Send response with updated player
    res.status(200).json({ message: 'Player stats updated successfully', player });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllPlayers, getPlayerById, addPlayer, updatePlayer, deletePlayer ,updatePlayerStats};
