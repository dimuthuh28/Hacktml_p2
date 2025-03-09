import "../../styles/TournamentSummary.css";
import "../../styles/TournamentSummary.css"

import { Container, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";

// import axios from "axios";

const TournamentSummary = () => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/players");
            const data = await response.json();
            setPlayers(data);
        } catch (error) {
            console.error("Error fetching players:", error);
        }
    };

    // Sorting Players by Different Categories
    const sortedByRuns = [...players].sort((a, b) => b.stats.totalRuns - a.stats.totalRuns);
    const sortedByWickets = [...players].sort((a, b) => b.stats.wickets - a.stats.wickets);
    const sortedByBattingStrikeRate = [...players].sort((a, b) => b.calculated.battingStrikeRate - a.calculated.battingStrikeRate);
    const sortedByBattingAverage = [...players].sort((a, b) => b.calculated.battingAverage - a.calculated.battingAverage);
    const sortedByBowlingStrikeRate = [...players].sort((a, b) => b.calculated.bowlingStrikeRate - a.calculated.bowlingStrikeRate);
    const sortedByEconomyRate = [...players].sort((a, b) => a.calculated.economyRate - b.calculated.economyRate); // Lower is better

    // 🏏 Function to Render Tables
    const renderTable = (title, sortedList, columns) => (
      <>
          <Typography variant="h6" sx={{ mt: 3 }}>{title}</Typography>
          <Table>
              <TableHead>
                  <TableRow>
                      <TableCell><strong>Rank</strong></TableCell>
                      <TableCell><strong>Player Name</strong></TableCell>
                      {columns.map((col) => (
                          <TableCell key={col.key}><strong>{col.label}</strong></TableCell>
                      ))}
                  </TableRow>
              </TableHead>
              <TableBody>
                  {sortedList.slice(0, 5).map((player, index) => (
                      <TableRow key={player._id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{`${player.firstName} ${player.lastName}`}</TableCell>
                          {columns.map((col) => (
                              <TableCell key={col.key}>
                                  {typeof player[col.category][col.key] === "number" 
                                      ? (player[col.category][col.key] % 1 === 0 
                                          ? player[col.category][col.key] // No decimal if whole number
                                          : player[col.category][col.key].toFixed(2)) // Keep two decimals otherwise
                                      : player[col.category][col.key]}
                              </TableCell>
                          ))}
                      </TableRow>
                  ))}
              </TableBody>
          </Table>
      </>
  );
  

    return (
        <Container>
            <Typography variant="h4" gutterBottom>🏏 Tournament Summary</Typography>

            {/* Top 5 Players by Most Runs */}
            {renderTable("Top 5 Players by Most Runs", sortedByRuns, [
                { key: "totalRuns", label: "Total Runs", category: "stats" },
                { key: "ballsFaced", label: "Balls Faced", category: "stats" },
                { key: "inningsPlayed", label: "Innings Played", category: "stats" },
            ])}

            {/* Top 5 Players by Most Wickets */}
            {renderTable("Top 5 Players by Most Wickets", sortedByWickets, [
                { key: "wickets", label: "Wickets", category: "stats" },
                { key: "oversBowled", label: "Overs Bowled", category: "stats" },
                { key: "runsConceded", label: "Runs Conceded", category: "stats" },
            ])}

            {/* Top 5 Players by Batting Strike Rate */}
            {renderTable("Top 5 Players by Batting Strike Rate", sortedByBattingStrikeRate, [
                { key: "battingStrikeRate", label: "Batting Strike Rate", category: "calculated" },
            ])}

            {/* Top 5 Players by Batting Average */}
            {renderTable("Top 5 Players by Batting Average", sortedByBattingAverage, [
                { key: "battingAverage", label: "Batting Average", category: "calculated" },
            ])}

            {/* Top 5 Players by Bowling Strike Rate */}
            {renderTable("Top 5 Players by Bowling Strike Rate", sortedByBowlingStrikeRate, [
                { key: "bowlingStrikeRate", label: "Bowling Strike Rate", category: "calculated" },
            ])}

            {/* Top 5 Players by Economy Rate */}
            {renderTable("Top 5 Players by Economy Rate", sortedByEconomyRate, [
                { key: "economyRate", label: "Economy Rate", category: "calculated" },
            ])}

        </Container>
    );
};

export default TournamentSummary;
