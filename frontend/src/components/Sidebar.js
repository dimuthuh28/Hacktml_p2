import "../styles/Sidebar.css"; // Include the styles for the sidebar

import { Link } from "react-router-dom";
import React from "react";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>Spirit11</h2>
      </div>
      <ul className="sidebar-list">
        <li>
          <Link to="/admindash/players" className="sidebar-item">
            Players
          </Link>
        </li>
        <li>
          <Link to="/admindash/stats" className="sidebar-item">
            Player Stats
          </Link>
        </li>
        <li>
          <Link to="/admindash/summary" className="sidebar-item">
            Tournament Summary
          </Link>
        </li>
        <li>
          <Link to="/chatbot" className="sidebar-item">
            Spirit11
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
