import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Paper, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";

// Styled edit button component
const EditButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  marginTop: 16,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const PlayerStatsView = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null); // State for the player being edited
  const { id } = useParams();

  // Fetch all players for the list
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/players');
        const data = await response.json();
        setPlayers(data);
        setFilteredPlayers(data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchPlayers();
  }, []);

  // Fetch player details by ID if needed
  useEffect(() => {
    if (id) {
      const fetchPlayerDetails = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/players/${id}`);
          const data = await response.json();
          setExpandedPlayer(data);
        } catch (error) {
          console.error("Error fetching player details:", error);
        }
      };
      fetchPlayerDetails();
    }
  }, [id]);

  // Handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    const filtered = players.filter(player =>
      `${player.firstName} ${player.lastName}`.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredPlayers(filtered);
  };

  // Handle player selection
  const handlePlayerClick = (playerId) => {
    const player = players.find(player => player._id === playerId);
    setExpandedPlayer(player);
    setSelectedTab(0);
    setOpen(true);
  };

  // Handle tab changes
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Open the modal and set the player for editing
  const handleEditPlayer = () => {
    setEditingPlayer({ ...expandedPlayer });
  };

  // Handle input changes for player stats data
  const handleStatsInputChange = (event) => {
    const { name, value } = event.target;
    setEditingPlayer((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [name]: value,
      },
    }));
  };

  // Handle input changes for player category
  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setEditingPlayer((prev) => ({
      ...prev,
      category: value,
    }));
  };

  // Handle player update
  const handleUpdatePlayer = async () => {
    try {
      if (!editingPlayer) return;

      // Extract only the stats and category values from the editing player
      const updatedPlayerData = {
        totalRuns: editingPlayer.stats.totalRuns,
        ballsFaced: editingPlayer.stats.ballsFaced,
        inningsPlayed: editingPlayer.stats.inningsPlayed,
        wickets: editingPlayer.stats.wickets,
        oversBowled: editingPlayer.stats.oversBowled,
        runsConceded: editingPlayer.stats.runsConceded,
        category: editingPlayer.category
      };

      // Send the updated player data to the backend
      const response = await fetch(`http://localhost:5000/api/players/playerstate/${expandedPlayer._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPlayerData),
      });

      if (response.ok) {
        // Fetch the updated player to ensure we have the latest data with recalculated values
        const playerResponse = await fetch(`http://localhost:5000/api/players/${expandedPlayer._id}`);
        const updatedPlayer = await playerResponse.json();

        // Update the state with the updated player
        setPlayers(players.map(player =>
          player._id === updatedPlayer._id ? updatedPlayer : player
        ));
        setExpandedPlayer(updatedPlayer); // Update the expanded player view
        setEditingPlayer(null); // Reset editing state
      } else {
        console.error("Error updating player:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating player:", error);
    }
  };

  // Close the modal
  const handleClose = () => {
    setOpen(false);
    setEditingPlayer(null); // Reset editing state when closing
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingPlayer(null);
  };

  return (
    <Container>
      <Typography variant="h4" align="center">Player List</Typography>
      <TextField
        label="Search Players"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ marginBottom: 20 }}
      />

      <Paper style={{ padding: 20, marginTop: 20 }}>
        <List>
          {filteredPlayers.map((player) => (
            <ListItem 
              key={player._id} 
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
              }}
            >
              <ListItemText primary={`${player.firstName} ${player.lastName}`} />
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<VisibilityIcon />}
                onClick={() => handlePlayerClick(player._id)}
              >
                View
              </Button>
            </ListItem>
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
                    {editingPlayer ? (
                      <>
                        <TextField
                          label="Category"
                          variant="outlined"
                          fullWidth
                          value={editingPlayer.category}
                          onChange={handleCategoryChange}
                          name="category"
                          style={{ marginBottom: 10 }}
                        />
                        <TextField
                          label="Matches Played"
                          variant="outlined"
                          fullWidth
                          value={editingPlayer.stats.inningsPlayed}
                          onChange={handleStatsInputChange}
                          name="inningsPlayed"
                          style={{ marginBottom: 10 }}
                        />
                        <TextField
                          label="Total Runs"
                          variant="outlined"
                          fullWidth
                          value={editingPlayer.stats.totalRuns}
                          onChange={handleStatsInputChange}
                          name="totalRuns"
                          style={{ marginBottom: 10 }}
                        />
                        <TextField
                          label="Balls Faced"
                          variant="outlined"
                          fullWidth
                          value={editingPlayer.stats.ballsFaced}
                          onChange={handleStatsInputChange}
                          name="ballsFaced"
                          style={{ marginBottom: 10 }}
                        />
                        <TextField
                          label="Wickets"
                          variant="outlined"
                          fullWidth
                          value={editingPlayer.stats.wickets}
                          onChange={handleStatsInputChange}
                          name="wickets"
                          style={{ marginBottom: 10 }}
                        />
                        <TextField
                          label="Overs Bowled"
                          variant="outlined"
                          fullWidth
                          value={editingPlayer.stats.oversBowled}
                          onChange={handleStatsInputChange}
                          name="oversBowled"
                          style={{ marginBottom: 10 }}
                        />
                        <TextField
                          label="Runs Conceded"
                          variant="outlined"
                          fullWidth
                          value={editingPlayer.stats.runsConceded}
                          onChange={handleStatsInputChange}
                          name="runsConceded"
                          style={{ marginBottom: 10 }}
                        />
                      </>
                    ) : (
                      <>
                        <Typography variant="body1"><strong>Category:</strong> {expandedPlayer.category}</Typography>
                        <Typography variant="body1"><strong>Matches Played:</strong> {expandedPlayer.stats.inningsPlayed}</Typography>
                        <Typography variant="body1"><strong>Total Runs:</strong> {expandedPlayer.stats.totalRuns}</Typography>
                        <Typography variant="body1"><strong>Balls Faced:</strong> {expandedPlayer.stats.ballsFaced}</Typography>
                        <Typography variant="body1"><strong>Wickets:</strong> {expandedPlayer.stats.wickets}</Typography>
                        <Typography variant="body1"><strong>Overs Bowled:</strong> {expandedPlayer.stats.oversBowled}</Typography>
                        <Typography variant="body1"><strong>Runs Conceded:</strong> {expandedPlayer.stats.runsConceded}</Typography>
                      </>
                    )}
                    {editingPlayer ? (
                      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button 
                          onClick={handleCancelEdit} 
                          color="inherit"
                          variant="outlined"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleUpdatePlayer} 
                          color="primary"
                          variant="contained"
                        >
                          Save
                        </Button>
                      </Box>
                    ) : (
                      <EditButton 
                        onClick={handleEditPlayer} 
                        variant="contained" 
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </EditButton>
                    )}
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
                    <Typography variant="body1"><strong>Value in Rupees: </strong> Rs.{(expandedPlayer.calculated.points * 9 + 100) * 1000}</Typography>
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