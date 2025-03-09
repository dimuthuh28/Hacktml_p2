import "../../styles/TournamentSummary.css";

import { Container, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Paper } from "@mui/material";
import "../../styles/TournamentSummary.css"
const TournamentSummary = () => {
  const [summary, setSummary] = useState(null);



  if (!summary) return <p>Loading...</p>;

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
