import React from "react";
import Navbar from "../components/Navbar";
import "../styles/GuestHomePage.css";
import { useNavigate } from "react-router-dom";

const GuestHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="guest-home-container">
      <Navbar isLoggedIn={false} />
      
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Spirit11</h1>
          <p>The ultimate fantasy cricket platform for university tournaments</p>
        </div>
      </div>
      
      <div className="guest-content">
        <div className="about-section">
          <h2>About Spirit11</h2>
          <p>
            Spirit11 is a comprehensive fantasy cricket platform designed specifically for university tournaments. 
            Our system helps manage player data, oversee statistics, and ensure a smooth experience for all users. 
            Whether you're a casual fan or a serious strategist, Spirit11 offers the tools you need to enjoy fantasy cricket.
          </p>
        </div>
        
        <div className="features-section">
          <h2>How It Works</h2>
          <div className="feature-cards">
            <div className="feature-card">
              <div className="feature-icon">🏏</div>
              <h3>Draft Players</h3>
              <p>Select your dream team from a pool of university cricket players. Each player comes with detailed statistics to help you make informed decisions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Manage Budget</h3>
              <p>Work within your allocated budget to build a balanced team. Strategic spending is key to creating a competitive squad.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Track Statistics</h3>
              <p>Follow real-time player performance with comprehensive statistics. Make data-driven decisions to optimize your team.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Assistant</h3>
              <p>Get help from our Spiriter Chatbot, an AI-powered assistant that provides recommendations and insights to help you make smart picks.</p>
            </div>
          </div>
        </div>
        
        <div className="user-journey-section">
          <h2>Your Journey with Spirit11</h2>
          <div className="journey-steps">
            <div className="journey-step">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Create your account and join the Spirit11 community.</p>
            </div>
            <div className="journey-step">
              <div className="step-number">2</div>
              <h3>Build Your Team</h3>
              <p>Draft players within your budget to create your dream team.</p>
            </div>
            <div className="journey-step">
              <div className="step-number">3</div>
              <h3>Compete</h3>
              <p>Join tournaments and compete against other managers.</p>
            </div>
            <div className="journey-step">
              <div className="step-number">4</div>
              <h3>Win Prizes</h3>
              <p>Climb the leaderboard and win exciting prizes.</p>
            </div>
          </div>
        </div>
        
        <div className="cta-section">
          <h2>Ready to Get Started?</h2>
          <p>Join Spirit11 today and experience the thrill of fantasy cricket!</p>
          <div className="cta-buttons">
            <button onClick={() => navigate("/signup")} className="primary-button">Create Account</button>
            <button onClick={() => navigate("/login")} className="secondary-button">Login</button>
          </div>
        </div>
      </div>
      
      <footer className="guest-footer">
        <p>&copy; {new Date().getFullYear()} Spirit11. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default GuestHomePage;
