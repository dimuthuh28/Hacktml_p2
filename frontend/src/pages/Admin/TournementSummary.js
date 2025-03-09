import "../../styles/TournamentSummary.css";

import { Container, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
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

    // Sorting players by stats (descending order)
    const sortPlayersByStat = (stat) => {
        return [...filteredPlayers].sort((a, b) => b.calculated[stat] - a.calculated[stat]);
    };

    // Ranking players based on a specific stat
    const rankPlayers = (sortedPlayers) => {
        return sortedPlayers.map((player, index) => ({
            ...player,
            rank: index + 1 // Assign rank starting from 1
        }));
    };

    // Get sorted and ranked players for each stat
    const sortedByBattingStrikeRate = rankPlayers(sortPlayersByStat("battingStrikeRate"));
    const sortedByBattingAverage = rankPlayers(sortPlayersByStat("battingAverage"));
    const sortedByBowlingStrikeRate = rankPlayers(sortPlayersByStat("bowlingStrikeRate"));
    const sortedByEconomyRate = rankPlayers(sortPlayersByStat("economyRate"));

    return (
        <Container>
            <TextField
                label="Search Players"
                variant="outlined"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                margin="normal"
            />
            
            <h3>Top 5 Players by Most Runs</h3>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Rank</strong></TableCell>
                        <TableCell><strong>Player Name</strong></TableCell>
                        <TableCell><strong>Total Runs</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedByBattingStrikeRate.slice(0, 5).map((player) => (
                        <TableRow key={player._id}>
                            <TableCell>{player.rank}</TableCell>
                            <TableCell>{`${player.firstName} ${player.lastName}`}</TableCell>
                            <TableCell>{player.stats.totalRuns}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <h3>Top 5 Players by Batting Strike Rate</h3>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Rank</strong></TableCell>
                        <TableCell><strong>Player Name</strong></TableCell>
                        <TableCell><strong>Batting Strike Rate</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedByBattingStrikeRate.slice(0, 5).map((player) => (
                        <TableRow key={player._id}>
                            <TableCell>{player.rank}</TableCell>
                            <TableCell>{`${player.firstName} ${player.lastName}`}</TableCell>
                            <TableCell>{player.calculated.battingStrikeRate}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <h3>Top 5 Players by Batting Average</h3>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Rank</strong></TableCell>
                        <TableCell><strong>Player Name</strong></TableCell>
                        <TableCell><strong>Batting Average</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedByBattingAverage.slice(0, 5).map((player) => (
                        <TableRow key={player._id}>
                            <TableCell>{player.rank}</TableCell>
                            <TableCell>{`${player.firstName} ${player.lastName}`}</TableCell>
                            <TableCell>{player.calculated.battingAverage}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <h3>Top 5 Players by Bowling Strike Rate</h3>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Rank</strong></TableCell>
                        <TableCell><strong>Player Name</strong></TableCell>
                        <TableCell><strong>Bowling Strike Rate</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedByBowlingStrikeRate.slice(0, 5).map((player) => (
                        <TableRow key={player._id}>
                            <TableCell>{player.rank}</TableCell>
                            <TableCell>{`${player.firstName} ${player.lastName}`}</TableCell>
                            <TableCell>{player.calculated.bowlingStrikeRate}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <h3>Top 5 Players by Economy Rate</h3>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Rank</strong></TableCell>
                        <TableCell><strong>Player Name</strong></TableCell>
                        <TableCell><strong>Economy Rate</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedByEconomyRate.slice(0, 5).map((player) => (
                        <TableRow key={player._id}>
                            <TableCell>{player.rank}</TableCell>
                            <TableCell>{`${player.firstName} ${player.lastName}`}</TableCell>
                            <TableCell>{player.calculated.economyRate}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
};

export default TournamentSummary;
