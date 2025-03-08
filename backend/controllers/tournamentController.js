const Tournament = require('../models/Tournament');

// Get the tournament summary
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
        $unwind: '$teamDetails'
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
          totalRunsConceded: { $sum: '$totalRunsConceded' }
        }
      }
    ]);

    if (!tournament) {
      return res.status(404).json({ message: "Tournament summary not found!" });
    }

    res.json({
      tournamentSummary: tournament[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
