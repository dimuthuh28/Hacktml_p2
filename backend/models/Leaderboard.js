const mongoose = require('mongoose');
const Leaderboard = require('../models/Leaderboard');
const Team = require('../models/Team');
const User = require('../models/User');

const getTeamLeaderboard = async () => {
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
          totalPoints: { $sum: "$playerStats.points" } // Sum all player points
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

    return leaderboard;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
};

// Example call
getTeamLeaderboard().then(console.log).catch(console.error);
