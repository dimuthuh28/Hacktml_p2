const Team = require('../models/Team');
const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');

const getTeamLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Team.aggregate([
      {
        $lookup: {
          from: "leaderboards",
          localField: "selectedPlayers",
          foreignField: "player",
          as: "playerStats"
        }
      },
      {
        $addFields: {
          totalPoints: { $sum: "$playerStats.points" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      {
        $unwind: "$userInfo"
      },
      {
        $project: {
          _id: 0,
          teamId: "$_id",
          user: "$userInfo.username",
          totalPoints: 1
        }
      },
      { $sort: { totalPoints: -1 } }
    ]);

    // Assign ranks dynamically
    leaderboard.forEach((team, index) => {
      team.rank = index + 1;
    });

    res.status(200).json({ success: true, leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getTeamLeaderboard };
