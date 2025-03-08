import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Paper } from "@mui/material";
import "../../styles/TournamentSummary.css"
const TournamentSummary = () => {
  const [summary, setSummary] = useState(null);



  if (!summary) return <p>Loading...</p>;

  return (
    <Container>
      <Typography variant="h4">Tournament Summary</Typography>
      <Paper style={{ padding: 20, marginTop: 10 }}>
        <Typography>Total Runs: {summary.totalRuns}</Typography>
        <Typography>Total Wickets: {summary.totalWickets}</Typography>
        <Typography>Highest Run Scorer: {summary.topScorer.name} ({summary.topScorer.runs} runs)</Typography>
        <Typography>Highest Wicket Taker: {summary.topBowler.name} ({summary.topBowler.wickets} wickets)</Typography>
      </Paper>
    </Container>
  );
};

export default TournamentSummary;
