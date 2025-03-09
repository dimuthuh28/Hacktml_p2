import "../../styles/PlayersView.css";

import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import AddIcon from '@mui/icons-material/Add';

const PlayersView = () => {
    const [players, setPlayers] = useState([]);
    const [search, setSearch] = useState("");
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [editForm, setEditForm] = useState({ firstName: "", lastName: "", university: "", category: "" });
    const [addPlayerOpen, setAddPlayerOpen] = useState(false);
    const [newPlayer, setNewPlayer] = useState({
        firstName: "",
        lastName: "",
        university: "",
        category: "",
        stats: {
            totalRuns: 0,
            ballsFaced: 0,
            inningsPlayed: 0,
            wickets: 0,
            oversBowled: 0,
            runsConceded: 0
        }
    });

    // List of universities from your schema
    const universities = [
        'University of Colombo',
        'University of Peradeniya',
        'University of Moratuwa',
        'University of Ruhuna',
        'University of Jaffna',
        'University of Visual and Performing Arts',
        'University of Sri Jayawardanapura',
        'Eastern University',
        'South Eastern University',
        'University of Kelaniya'
    ];

    // Player categories
    const categories = ['Batsman', 'All-Rounder', 'Bowler'];

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

    // Delete Player
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this player?")) {
            try {
                await fetch(`http://localhost:5000/api/players/deletePlayer/${id}`, { method: "DELETE" });
                setPlayers(players.filter(player => player._id !== id));
            } catch (error) {
                console.error("Error deleting player:", error);
            }
        }
    };

    // Start Editing
    const handleEdit = (player) => {
        setEditingPlayer(player._id);
        setEditForm({ firstName: player.firstName, lastName: player.lastName, university: player.university, category: player.category });
    };

    // Update Player
    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/players/updatePlayer/${editingPlayer}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });

            if (response.ok) {
                fetchPlayers(); // Refresh the list
                setEditingPlayer(null);
            }
        } catch (error) {
            console.error("Error updating player:", error);
        }
    };

    // Open add player dialog
    const handleAddPlayerOpen = () => {
        setAddPlayerOpen(true);
    };

    // Close add player dialog
    const handleAddPlayerClose = () => {
        setAddPlayerOpen(false);
        // Reset the form
        setNewPlayer({
            firstName: "",
            lastName: "",
            university: "",
            category: "",
            stats: {
                totalRuns: 0,
                ballsFaced: 0,
                inningsPlayed: 0,
                wickets: 0,
                oversBowled: 0,
                runsConceded: 0
            }
        });
    };

    // Handle input changes for new player form
    const handleNewPlayerChange = (event) => {
        const { name, value } = event.target;
        setNewPlayer((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle input changes for new player stats
    const handleNewPlayerStatsChange = (event) => {
        const { name, value } = event.target;
        setNewPlayer((prev) => ({
            ...prev,
            stats: {
                ...prev.stats,
                [name]: Number(value),
            },
        }));
    };

    // Handle add new player submission
    const handleAddPlayer = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/players/addPlayer', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPlayer),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Player added:", result);
                
                // Refresh the players list
                fetchPlayers();
                
                // Close the dialog
                handleAddPlayerClose();
            } else {
                console.error("Error adding player:", response.statusText);
            }
        } catch (error) {
            console.error("Error adding player:", error);
        }
    };

    // Filtered Players
    const filteredPlayers = players.filter(player =>
        `${player.firstName} ${player.lastName}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
                <h2>Players List</h2>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    onClick={handleAddPlayerOpen}
                >
                    Add Player
                </Button>
            </Box>
            
            <TextField
                label="Search Player"
                variant="outlined"
                fullWidth
                margin="normal"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>University</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredPlayers.map(player => (
                        <TableRow key={player._id}>
                            {editingPlayer === player._id ? (
                                <>
                                    <TableCell>
                                        <TextField
                                            value={editForm.firstName}
                                            onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                            margin="dense"
                                            size="small"
                                        />
                                        <TextField
                                            value={editForm.lastName}
                                            onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                            margin="dense"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={editForm.university}
                                            onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                                            margin="dense"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={editForm.category}
                                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                            margin="dense"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={handleUpdate}>Save</Button>
                                        <br></br>
                                        <Button variant="contained" color="secondary" onClick={() => setEditingPlayer(null)}>Cancel</Button>
                                    </TableCell>
                                </>
                            ) : (
                                <>
                                    <TableCell>{player.firstName} {player.lastName}</TableCell>
                                    <TableCell>{player.university}</TableCell>
                                    <TableCell>{player.category}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="warning" onClick={() => handleEdit(player)}>Edit</Button>
                                        <br></br>
                                        <Button variant="contained" color="error" onClick={() => handleDelete(player._id)}>Delete</Button>
                                    </TableCell>
                                </>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Add Player Dialog */}
            <Dialog open={addPlayerOpen} onClose={handleAddPlayerClose} maxWidth="md" fullWidth>
                <DialogTitle>Add New Player</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'grid', gap: 2 }}>
                        {/* Personal Information */}
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                required
                                label="First Name"
                                name="firstName"
                                fullWidth
                                value={newPlayer.firstName}
                                onChange={handleNewPlayerChange}
                                margin="normal"
                            />
                            <TextField
                                required
                                label="Last Name"
                                name="lastName"
                                fullWidth
                                value={newPlayer.lastName}
                                onChange={handleNewPlayerChange}
                                margin="normal"
                            />
                            
                            {/* University Select */}
                            <FormControl fullWidth margin="normal">
                                <InputLabel>University</InputLabel>
                                <Select
                                    required
                                    name="university"
                                    value={newPlayer.university}
                                    onChange={handleNewPlayerChange}
                                    label="University"
                                >
                                    {universities.map((university) => (
                                        <MenuItem key={university} value={university}>
                                            {university}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            
                            {/* Category Select */}
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Category</InputLabel>
                                <Select
                                    required
                                    name="category"
                                    value={newPlayer.category}
                                    onChange={handleNewPlayerChange}
                                    label="Category"
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        
                        {/* Stats Section */}
                        <Box sx={{ mb: 2 }}>
                            <h3>Player Statistics</h3>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <TextField
                                    label="Matches Played"
                                    name="inningsPlayed"
                                    type="number"
                                    fullWidth
                                    value={newPlayer.stats.inningsPlayed}
                                    onChange={handleNewPlayerStatsChange}
                                    margin="normal"
                                />
                                <TextField
                                    label="Total Runs"
                                    name="totalRuns"
                                    type="number"
                                    fullWidth
                                    value={newPlayer.stats.totalRuns}
                                    onChange={handleNewPlayerStatsChange}
                                    margin="normal"
                                />
                                <TextField
                                    label="Balls Faced"
                                    name="ballsFaced"
                                    type="number"
                                    fullWidth
                                    value={newPlayer.stats.ballsFaced}
                                    onChange={handleNewPlayerStatsChange}
                                    margin="normal"
                                />
                                <TextField
                                    label="Wickets"
                                    name="wickets"
                                    type="number"
                                    fullWidth
                                    value={newPlayer.stats.wickets}
                                    onChange={handleNewPlayerStatsChange}
                                    margin="normal"
                                />
                                <TextField
                                    label="Overs Bowled"
                                    name="oversBowled"
                                    type="number"
                                    fullWidth
                                    value={newPlayer.stats.oversBowled}
                                    onChange={handleNewPlayerStatsChange}
                                    margin="normal"
                                />
                                <TextField
                                    label="Runs Conceded"
                                    name="runsConceded"
                                    type="number"
                                    fullWidth
                                    value={newPlayer.stats.runsConceded}
                                    onChange={handleNewPlayerStatsChange}
                                    margin="normal"
                                />
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddPlayerClose} color="inherit">Cancel</Button>
                    <Button 
                        onClick={handleAddPlayer} 
                        color="primary" 
                        variant="contained"
                        disabled={!newPlayer.firstName || !newPlayer.lastName || !newPlayer.university || !newPlayer.category}
                    >
                        Add Player
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default PlayersView;