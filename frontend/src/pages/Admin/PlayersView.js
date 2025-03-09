import "../../styles/PlayersView.css";

import { Container, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const PlayersView = () => {
    const [players, setPlayers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        // Fetch players from backend API
        const fetchPlayers = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/players"); // Adjust if needed
                const data = await response.json();
                setPlayers(data);
            } catch (error) {
                console.error("Error fetching players:", error);
            }
        };
        fetchPlayers();
    }, []);

    // Filtering players based on first or last name
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredPlayers.map(player => (
                        <TableRow key={player._id}>
                            <TableCell>{player.firstName} {player.lastName}</TableCell>
                            <TableCell>{player.university}</TableCell>
                            <TableCell>{player.category}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
};

export default PlayersView;
