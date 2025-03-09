import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Dashboard.css";

const defaultProfilePic = "/AvatarMaker.png"; 

const UserDashboard = ({ user }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

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
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Check if 'user' is available and provide a fallback
  const userName = user?.name || "Guest";

  return (
    <div className="dashboard">
      <h2>Welcome, {userName}!</h2>

      {loading ? (
        <div className="loading">Loading players...</div>
      ) : (
        <div className="carousel-container">
          <Slider {...settings}>
            {players.map((player) => (
              <div key={player._id} className="player-card">
                <img src={defaultProfilePic} alt="Profile" className="profile-pic" />
                <h3>{player.firstName} {player.lastName}</h3>
                <p><strong>University:</strong> {player.university}</p>
                <p><strong>Role:</strong> {player.category}</p>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
