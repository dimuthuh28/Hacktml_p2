import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ isLoggedIn, username, role }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Add menu-open class to body when menu is open
  useEffect(() => {
    const body = document.body;
    const container = document.querySelector('.dashboard-container') || document.querySelector('div');
    
    if (menuOpen) {
      body.classList.add('menu-open');
      if (container) container.classList.add('menu-open');
    } else {
      body.classList.remove('menu-open');
      if (container) container.classList.remove('menu-open');
    }
    
    return () => {
      body.classList.remove('menu-open');
      if (container) container.classList.remove('menu-open');
    };
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
    setMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
    setMenuOpen(false);
  };

  const handleSignupClick = () => {
    navigate("/signup");
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <h1>SecureConnect</h1>
      </div>
      
      <div className="menu-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
        {isLoggedIn ? (
          <>
            <button className="nav-button" onClick={() => { navigate(role === 'admin' ? '/admin' : '/dashboard'); setMenuOpen(false); }}>
              {role === 'admin' ? 'Admin Panel' : 'Dashboard'}
            </button>
            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="nav-button" onClick={() => { navigate('/'); setMenuOpen(false); }}>
              Home
            </button>
            <button className="nav-button" onClick={handleLoginClick}>
              Login
            </button>
            <button className="nav-button" onClick={handleSignupClick}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
