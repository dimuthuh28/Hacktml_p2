const Tournament = require('../models/Tournament');

// Get the tournament summary
const Tournament = require('../models/Tournament');

exports.getTournamentSummary = async (req, res) => {
  try {
    const tournament = await Tournament.aggregate([
      {
        $lookup: {
          from: 'teams',
          localField: 'teams',
          foreignField: '_id',
          as: 'teamDetails'
        }
      },
      {
        $group: {
          _id: null,
          totalMatches: { $sum: '$totalMatches' },
          totalPlayers: { $sum: '$totalPlayers' },
          totalRuns: { $sum: '$totalRuns' },
          totalWickets: { $sum: '$totalWickets' },
          totalBallsFaced: { $sum: '$totalBallsFaced' },
          totalOversBowled: { $sum: '$totalOversBowled' },
          totalRunsConceded: { $sum: '$totalRunsConceded' },
          totalTournaments: { $sum: 1 }, // Count total tournaments
          totalTeams: { $sum: { $size: "$teams" } } // Count total teams in all tournaments
        }
      }
    ]);

    if (!tournament.length) {
      return res.status(404).json({ message: "Tournament summary not found!" });
    }

    res.json({
      tournamentSummary: tournament[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error!" });
  }
};

