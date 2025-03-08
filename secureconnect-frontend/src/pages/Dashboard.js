import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username"); // Get username from localStorage

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="logo">
          <h1>SecureConnect</h1>
        </div>
        <div className="nav-links">
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h2>Hello, {username || "User"}! Welcome to SecureConnect!</h2>
        <p>Your personalized dashboard is now ready.</p>
      </div>
    </div>
  );
};

export default Dashboard;
