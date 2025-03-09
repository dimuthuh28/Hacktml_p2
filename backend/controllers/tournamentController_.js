const Tournament = require('../models/Tournament_');

// Get all tournaments
exports.getAllTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.find().populate('teams');
        res.json(tournaments);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Create a new tournament
exports.createTournament = async (req, res) => {
    try {
        const { name, startDate, endDate, teams } = req.body;

        const newTournament = new Tournament({
            name,
            startDate,
            endDate,
            teams
        });

        await newTournament.save();
        res.status(201).json({ message: "Tournament created successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Get Tournament Summary
exports.getTournamentSummary = async (req, res) => {
    try {
        const summary = await Tournament.aggregate([
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
                    totalTournaments: { $sum: 1 },
                    totalTeams: { $sum: { $size: "$teams" } }
                }
            }
        ]);

        if (!summary.length) {
            return res.status(404).json({ message: "Tournament summary not found!" });
        }

        res.json({ tournamentSummary: summary[0] });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
