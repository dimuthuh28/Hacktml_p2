import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css"

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>Spirit11</h2>
      </div>
      <ul className="sidebar-list">
        <li>
          <Link to="/players" className="sidebar-item">
            Players
          </Link>
        </li>
        <li>
          <Link to="/stats" className="sidebar-item">
            Player Stats
          </Link>
        </li>
        <li>
          <Link to="/summary" className="sidebar-item">
            Tournament Summary
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
