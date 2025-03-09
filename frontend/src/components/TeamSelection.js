import React, { useState, useEffect } from "react";
import "../styles/TeamSelection.css";

const TeamSelection = ({ user }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [remainingBudget, setRemainingBudget] = useState(9000000); // Initial budget
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch available players from the backend
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/players"); 
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchPlayers();
  }, []);

  // Handle player selection
  const handlePlayerSelection = (player) => {
    if (selectedPlayers.length < 11) {
      if (remainingBudget >= player.calculated.value) {
        setSelectedPlayers([...selectedPlayers, player]);
        setRemainingBudget(remainingBudget - player.calculated.value);
        setErrorMessage("");
      } else {
        setErrorMessage("Insufficient budget to select this player.");
      }
    } else {
      setErrorMessage("You can only select up to 11 players.");
    }
  };

  // Filter players based on the selected criteria
  const filterPlayers = () => {
    return players.filter((player) => !selectedPlayers.includes(player));
  };

  // Count the number of each role
  const countRoles = (role) => {
    return selectedPlayers.filter((player) => player.category === role).length;
  };

  // Ensure role constraints are met
  const canSelect = () => {
    return (
      countRoles("Batsman") < 5 &&
      countRoles("Bowler") < 3 &&
      countRoles("All-Rounder") < 2 &&
      selectedPlayers.length < 11
    );
  };

  return (
    <div className="team-selection">
      <h2>Team Selection</h2>
      <div className="budget">
        <p>Remaining Budget: ₹{remainingBudget}</p>
      </div>
      {errorMessage && <div className="error">{errorMessage}</div>}

      <div className="player-list">
        {filterPlayers().map((player) => (
          <div
            key={player._id}
            className="player-card"
            onClick={() => handlePlayerSelection(player)}
          >
            <img src="/images/default-profile.png" alt="Player" className="profile-pic" />
            <h3>{player.firstName} {player.lastName}</h3>
            <p>Role: {player.category}</p>
            <p>Price: ₹{player.calculated.value}</p>
          </div>
        ))}
      </div>

      <div className="selected-players">
        <h3>Selected Players</h3>
        <ul>
          {selectedPlayers.map((player) => (
            <li key={player._id}>
              {player.firstName} {player.lastName} - {player.category}
            </li>
          ))}
        </ul>
      </div>

      <button
        className="submit-button"
        disabled={selectedPlayers.length !== 11 || !canSelect()}
      >
        Submit Team
      </button>
    </div>
  );
};

export default TeamSelection;
