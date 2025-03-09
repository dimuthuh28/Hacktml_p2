import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Dashboard.css";
import "../styles/Reguserhome.css";

const defaultProfilePic = "/AvatarMaker.png";

const Reguserhome = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username"); // Get username from localStorage
  const role = localStorage.getItem("role") || "user"; // Get role from localStorage, default to "user"
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlayers, setShowPlayers] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/players"); 
        const data = await response.json();
        setPlayers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching players:", error);
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <Navbar isLoggedIn={true} username={username} role={role} />

      <div className="dashboard-content">
        <div className="welcome-banner">
          <h2>Hello, {username || "User"}! Welcome to Spirit11!</h2>
          <p>Your personalized dashboard is now ready. Explore players, build your team, and check the leaderboard.</p>
        </div>
        
        <div className="stats-summary">
          <div className="stat-card">
            <h3>My Team</h3>
            <p>0</p>
            <div className="stat-label">Players Selected</div>
          </div>
          <div className="stat-card">
            <h3>Leaderboard</h3>
            <p>--</p>
            <div className="stat-label">Current Rank</div>
          </div>
          <div className="stat-card">
            <h3>Available Players</h3>
            <p>{players.length}</p>
            <div className="stat-label">Total Players</div>
          </div>
        </div>
        
        <div className="action-buttons">
          <button onClick={() => navigate("/chatbot")}>
            <span>💬</span> Chat with Spirit11
          </button>
          <button onClick={() => setShowPlayers(!showPlayers)}>
            <span>{showPlayers ? "🔼" : "🔽"}</span> {showPlayers ? "Hide Players" : "Show Players"}
          </button>
          <button onClick={() => navigate("/Team")}>
            <span>👥</span> Select Your Team
          </button>
        </div>

        {showPlayers && (
          <div className="players-section">
            <h3>Available Players</h3>
            {loading ? (
              <div className="loading">Loading players...</div>
            ) : players.length > 0 ? (
              <div className="carousel-container">
                <Slider {...settings}>
                  {players.map((player, index) => (
                    <div key={player._id || index} className="player-card">
                      <img src={defaultProfilePic} alt="Profile" className="profile-pic" />
                      <h3>{player.firstName} {player.lastName}</h3>
                      <p><strong>University:</strong> {player.university || "N/A"}</p>
                      <p><strong>Role:</strong> {player.category || "Player"}</p>
                      
                      <div className="player-stats">
                        <div className="stat-item">
                          <div className="stat-value">{player.runs || "0"}</div>
                          <div className="stat-name">Runs</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-value">{player.wickets || "0"}</div>
                          <div className="stat-name">Wickets</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-value">{player.matches || "0"}</div>
                          <div className="stat-name">Matches</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            ) : (
              <p>No players available at the moment. Check back later!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reguserhome;
