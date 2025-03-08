import "../../styles/PlayerStats.css"

import { Container, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

const PlayerStatsView = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);

 
  if (!player) return <p>Loading...</p>;

  return (
    <Container>
      <Typography variant="h4">{player.name} - {player.team}</Typography>
      <Paper style={{ padding: 20, marginTop: 10 }}>
        <Typography>Matches: {player.matches}</Typography>
        <Typography>Runs: {player.runs}</Typography>
        <Typography>Wickets: {player.wickets}</Typography>
        <Typography>Batting Avg: {player.batting_avg}</Typography>
        <Typography>Bowling Economy: {player.bowling_economy}</Typography>
      </Paper>
    </Container>
  );
};

export default PlayerStatsView;
