import "../../styles/PlayersView.css";

import { Button, Container, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const PlayersView = () => {
    const [players, setPlayers] = useState([]);
    const [search, setSearch] = useState("");
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [editForm, setEditForm] = useState({ firstName: "", lastName: "", university: "", category: "" });

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

    // Filtered Players
    const filteredPlayers = players.filter(player =>
        `${player.firstName} ${player.lastName}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container>
            <h2>Players List</h2>
            <TextField
                label="Search Player"
                variant="outlined"
                fullWidth
                margin="normal"
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
                                        />
                                        <TextField
                                            value={editForm.lastName}
                                            onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={editForm.university}
                                            onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={editForm.category}
                                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
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
        </Container>
    );
};

export default PlayersView;
