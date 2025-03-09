import React from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">MyApp</div>
      <ul className="nav-links">
        <li><a href="/">Dashboard</a></li>
        <li><a href="/Leaderboard">Leaderboard</a></li>
        <li><a href="/Team">Select Team</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
