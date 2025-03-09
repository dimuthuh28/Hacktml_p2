import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Paper, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

const PlayerStatsView = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]); // State for filtered players
  const [expandedPlayer, setExpandedPlayer] = useState(null); // Track which player's details to show in the modal
  const [selectedTab, setSelectedTab] = useState(0); // Track which tab is selected
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [open, setOpen] = useState(false); // State for controlling modal visibility
  const { id } = useParams();  // To get the selected player ID from the URL

  // Fetch all players for the list
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/players');
        const data = await response.json();
        setPlayers(data);
        setFilteredPlayers(data); // Initialize filtered players with all players
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, []);

  // Fetch player details by ID if needed (for initial load or when ID changes)
  useEffect(() => {
    if (id) {
      const fetchPlayerDetails = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/players/${id}`);
          const data = await response.json();
          setExpandedPlayer(data); // Store selected player data
        } catch (error) {
          console.error("Error fetching player details:", error);
        }
      };

      fetchPlayerDetails();
    }
  }, [id]);  // This will re-run when the player ID changes

  // Toggle player details when a player is clicked
  const handlePlayerClick = (playerId) => {
    const player = players.find(player => player._id === playerId);
    setExpandedPlayer(player);  // Set the clicked player as the expanded player
    setSelectedTab(0); // Reset to first tab when a new player is selected
    setOpen(true); // Open the modal
  };

  // Handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    
    // Filter players based on search query
    const filtered = players.filter(player =>
      `${player.firstName} ${player.lastName}`.toLowerCase().includes(event.target.value.toLowerCase())
    );
    
    setFilteredPlayers(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue); // Change the selected tab
  };

  // Close the modal
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4">Player List</Typography>
      <br></br><br></br>
      
      {/* Search Input */}
      <TextField
        label="Search Players"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ marginBottom: 20 }}
      />

      <Paper style={{ padding: 20, marginTop: 10, display: "flex", height: "100%" }}>
        <List style={{ flex: 1, overflowY: 'auto' }}>
          {filteredPlayers.map((player) => (
            <div key={player._id}>
              <ListItem button onClick={() => handlePlayerClick(player._id)}>
                <ListItemText primary={`${player.firstName} ${player.lastName}`} />
              </ListItem>
            </div>
          ))}
        </List>
      </Paper>

      {/* Player Details Modal (Dialog) */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{expandedPlayer ? `${expandedPlayer.firstName} ${expandedPlayer.lastName}` : 'Player Details'}</DialogTitle>
        <DialogContent>
          {expandedPlayer && (
            <>
              <Typography variant="h6">University: {expandedPlayer.university}</Typography>
              
              {/* Tabs for organizing player details */}
              <Tabs value={selectedTab} onChange={handleTabChange} aria-label="player-details-tabs" style={{ marginTop: 20 }}>
                <Tab label="Stats" />
                <Tab label="Batting" />
                <Tab label="Bowling" />
                <Tab label="Points & Value" />
              </Tabs>

              <Box style={{ marginTop: 20 }}>
                {selectedTab === 0 && (
                  <Box>
                    <Typography variant="body1"><strong>Category:</strong> {expandedPlayer.category}</Typography>
                    <Typography variant="body1"><strong>Matches Played:</strong> {expandedPlayer.stats.inningsPlayed}</Typography>
                    <Typography variant="body1"><strong>Total Runs:</strong> {expandedPlayer.stats.totalRuns}</Typography>
                    <Typography variant="body1"><strong>Balls Faced:</strong> {expandedPlayer.stats.ballsFaced}</Typography>
                    <Typography variant="body1"><strong>Wickets:</strong> {expandedPlayer.stats.wickets}</Typography>
                  </Box>
                )}
                {selectedTab === 1 && (
                  <Box>
                    <Typography variant="body1"><strong>Batting Strike Rate:</strong> {expandedPlayer.calculated.battingStrikeRate}</Typography>
                    <Typography variant="body1"><strong>Batting Average:</strong> {expandedPlayer.calculated.battingAverage}</Typography>
                  </Box>
                )}
                {selectedTab === 2 && (
                  <Box>
                    <Typography variant="body1"><strong>Bowling Strike Rate:</strong> {expandedPlayer.calculated.bowlingStrikeRate}</Typography>
                    <Typography variant="body1"><strong>Economy Rate:</strong> {expandedPlayer.calculated.economyRate}</Typography>
                  </Box>
                )}
                {selectedTab === 3 && (
                  <Box>
                    <Typography variant="body1"><strong>Points:</strong> {expandedPlayer.calculated.points}</Typography>
                    <Typography variant="body1"><strong>Player Value:</strong> {expandedPlayer.calculated.value}</Typography>
                    <Typography variant="body1"><strong>Value in Rupees:</strong> {(expandedPlayer.calculated.points * 9 + 100)*1000}</Typography>
                  </Box>
                )}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PlayerStatsView;
