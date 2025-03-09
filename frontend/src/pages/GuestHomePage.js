import React from "react";
import Navbar from "../components/Navbar";
import "../styles/GuestHomePage.css";

const GuestHomePage = () => {
  return (
    <div className="guest-home-container">
      <Navbar isLoggedIn={false} />
      <div className="guest-content">
        <h1>Welcome to SecureConnect</h1>
        <p>Connect securely with our advanced platform.</p>
        
        {/* Add more content for the guest home page */}
        <div className="features-section">
          <h2>Features</h2>
          <div className="feature-cards">
            <div className="feature-card">
              <h3>Secure Communication</h3>
              <p>End-to-end encryption for all your communications.</p>
            </div>
            <div className="feature-card">
              <h3>User-Friendly Interface</h3>
              <p>Easy to navigate platform for all users.</p>
            </div>
            <div className="feature-card">
              <h3>24/7 Support</h3>
              <p>Our team is always available to help you.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestHomePage;
