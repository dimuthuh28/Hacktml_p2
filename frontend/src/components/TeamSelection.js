import "../styles/TeamSelection.css";

import React, { useEffect, useState } from "react";

const TeamSelection = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [remainingBudget, setRemainingBudget] = useState(9000000);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [teamExists, setTeamExists] = useState(false);
  const [userId, setUserId] = useState(null);

  // Get user ID from localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setErrorMessage("You must be logged in to select a team.");
    }
  }, []);

  // Fetch available players from the backend
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/players");
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching players:", error);
        setErrorMessage("Failed to load players. Please try again later.");
      }
    };

    fetchPlayers();
  }, []);

  // Check if user already has a team
  useEffect(() => {
    const checkExistingTeam = async () => {
      if (userId) {
        try {
          const response = await fetch(`http://localhost:5000/api/team/${userId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.team) {
              setTeamExists(true);
              setErrorMessage("You have already created a team. Changes are not allowed!");
            }
          }
        } catch (error) {
          console.error("Error checking existing team:", error);
        }
      }
    };

    if (userId) {
      checkExistingTeam();
    }
  }, [userId]);

  // Handle player selection
  const handlePlayerSelection = (player) => {
    if (teamExists) {
      setErrorMessage("You have already created a team. Changes are not allowed!");
      return;
    }

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

  // Handle player removal
  const handlePlayerRemoval = (playerToRemove) => {
    if (teamExists) {
      setErrorMessage("You have already created a team. Changes are not allowed!");
      return;
    }

    setSelectedPlayers(selectedPlayers.filter(player => player._id !== playerToRemove._id));
    setRemainingBudget(remainingBudget + playerToRemove.calculated.value);
    setErrorMessage("");
  };

  // Filter players based on the selected criteria
  const filterPlayers = () => {
    return players.filter((player) => !selectedPlayers.some(selected => selected._id === player._id));
  };

  // Count the number of each role
  const countRoles = (role) => {
    return selectedPlayers.filter((player) => player.category === role).length;
  };

  // Check if team composition meets requirements
  const canSelect = () => {
    // You can uncomment these constraints if needed
    // const batsmenCount = countRoles("Batsman");
    // const bowlersCount = countRoles("Bowler");
    // const allRoundersCount = countRoles("All-Rounder");
    
    // return (
    //   batsmenCount <= 5 &&
    //   bowlersCount <= 3 &&
    //   allRoundersCount <= 2 &&
    //   selectedPlayers.length === 11
    // );

    // Simplified version - just check if we have exactly 11 players
    return selectedPlayers.length === 11;
  };

  // Handle team submission
  const handleSubmitTeam = async () => {
    if (teamExists) {
      setErrorMessage("You have already created a team. Changes are not allowed!");
      return;
    }

    if (!userId) {
      setErrorMessage("You must be logged in to submit a team.");
      return;
    }

    if (!canSelect()) {
      setErrorMessage("You must select exactly 11 players.");
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch("http://localhost:5000/api/select-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          playerIds: selectedPlayers.map(player => player._id)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setTeamExists(true);
        setErrorMessage("");
      } else {
        setErrorMessage(data.message || "Failed to submit team. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting team:", error);
      setErrorMessage("An error occurred while submitting your team.");
    } finally {
      setLoading(false);
    }
  };

  if (teamExists) {
    return (
      <div className="team-selection">
        <h2>Your Team</h2>
        <div className="info-message success">
          You have already created your team. Changes are not allowed at this time.
        </div>
        <button 
          className="view-leaderboard-button"
          onClick={() => window.location.href = "/leaderboard"}
        >
          View Leaderboard
        </button>
      </div>
    );
  }

  return (
    <div className="team-selection">
      <h2>Team Selection</h2>
      <div className="budget">
        <p>Remaining Budget: ₹{remainingBudget}</p>
      </div>
      
      {errorMessage && <div className="error">{errorMessage}</div>}
      {successMessage && <div className="success">{successMessage}</div>}

      <div className="selected-players">
        <h3>Selected Players ({selectedPlayers.length}/11)</h3>
        {selectedPlayers.length > 0 ? (
          <ul>
            {selectedPlayers.map((player) => (
              <li key={player._id} onClick={() => handlePlayerRemoval(player)} className="selected-player-item">
                {player.firstName} {player.lastName} - {player.category} (₹{player.calculated.value})
                <span className="remove-icon">×</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No players selected yet</p>
        )}
      </div>

      <h3>Available Players</h3>
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

      <button
        className="submit-button"
        disabled={!canSelect() || loading}
        onClick={handleSubmitTeam}
      >
        {loading ? "Submitting..." : "Submit Team"}
      </button>
    </div>
  );
};

export default TeamSelection;