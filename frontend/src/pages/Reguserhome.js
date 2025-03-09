import React from "react";
import "../styles/Reguserhome.css";
import { useNavigate } from "react-router-dom";

const Reguserhome = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username"); // Get username from localStorage

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <h1>Spirit11</h1>
        </div>
        <div className="nav-links">
          <button className="nav-button" onClick={() => navigate("/players")}>
            Players
          </button>
          <button className="nav-button" onClick={() => navigate("/teams")}>
            Teams
          </button>
          <button className="nav-button" onClick={() => navigate("/chatbot")}>
            Chatbot
          </button>
          <button className="nav-button" onClick={() => navigate("/leaderboard")}>
            Leaderboard
          </button>
          <button className="nav-button logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content">
        <h1 className="dashboard-title">Welcome to Spirit11, {username || "User"}!</h1>
        <p className="dashboard-subtitle">Your personalized dashboard is now ready.</p>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <div className="footer-nav">
            <ul>
              <li><a href="/players">Players</a></li>
              <li><a href="/teams">Teams</a></li>
              <li><a href="/chatbot">Chatbot</a></li>
              <li><a href="/leaderboard">Leaderboard</a></li>
              <li><a href="/login" className="logout-btn">Logout</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <ul>
              <li>Email: contact@spirit11.com</li>
              <li><a href="https://facebook.com/spirit11" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://instagram.com/spirit11" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 SPIRIT11 Inc. by HACKtML from UCSC</p>
        </div>
      </footer>
    </div>
  );
};

export default Reguserhome;
