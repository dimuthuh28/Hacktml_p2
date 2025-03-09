import "../../styles/TournamentSummary.css";

import { Button, Container, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const TournamentSummary = () => {
    const [players, setPlayers] = useState([]);
    const [search, setSearch] = useState("");

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

    // Filtered Players based on search input
    const filteredPlayers = players.filter(player =>
        `${player.firstName} ${player.lastName}`.toLowerCase().includes(search.toLowerCase())
    );

    // Sorting players by most runs (descending order)
    const sortedByRuns = [...filteredPlayers].sort((a, b) => b.stats.totalRuns - a.stats.totalRuns);

    // Sorting players by most wickets (descending order)
    const sortedByWickets = [...filteredPlayers].sort((a, b) => b.stats.wickets - a.stats.wickets);

    return (
        <Container>
            <h3>Top 5 Players by Most Runs</h3>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Player Name</strong></TableCell>
                        <TableCell><strong>Total Runs</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedByRuns.slice(0, 5).map((player) => (
                        <TableRow key={player._id}>
                            <TableCell>{`${player.firstName} ${player.lastName}`}</TableCell>
                            <TableCell>{player.stats.totalRuns}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <h3>Top 5 Players by Most Wickets</h3>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Player Name</strong></TableCell>
                        <TableCell><strong>Wickets</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedByWickets.slice(0, 5).map((player) => (
                        <TableRow key={player._id}>
                            <TableCell>{`${player.firstName} ${player.lastName}`}</TableCell>
                            <TableCell>{player.stats.wickets}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
};

export default TournamentSummary;
