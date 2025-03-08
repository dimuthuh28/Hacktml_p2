import { useEffect,useState, useSyncExternalStore } from "react";
import { Table,TableHead,TableRow, TableCell, TableBody, TextField, Container } from "@mui/material";
import "../../styles/PlayersView.css"
const PlayersView=()=>{
    const [players,setPlayers]=useState([]);
    const [search,setSearch]=useState("");
    
    const filteredPlayers=players.filter(player=>
        player.name.toLowerCase().includes(search.toLowerCase())
    );

    return(
        <Container>
             <h2>Players List</h2>
            <TextField label="Search Player" variant="outlined" fullWidth margin="normal" 
             onChange={(e) => setSearch(e.target.value)}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Team</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPlayers.map(player => (
            <TableRow key={player.id}>
                <TableCell>{player.name}</TableCell>
                 <TableCell>{player.team}</TableCell>
                 <TableCell>{player.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    
        </Container>
    );
}
export default PlayersView;