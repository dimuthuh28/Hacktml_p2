import React from "react";
import { useNavigate } from "react-router-dom";

const GuestHomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <h1>SecureConnect</h1>
        </div>
        <div className="nav-links">
          {!token ? (
            <>
              <button className="nav-button" onClick={handleLoginClick}>
                Login
              </button>
              <button className="nav-button" onClick={handleSignupClick}>
                Sign Up
              </button>
            </>
          ) : (
            <button
              className="nav-button"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      <div className="guest-home-content">
        <h2>Welcome to SecureConnect</h2>
        <p>Your secure authentication system for a safe and personalized experience.</p>
      </div>
    </div>
  );
};

export default GuestHomePage;
