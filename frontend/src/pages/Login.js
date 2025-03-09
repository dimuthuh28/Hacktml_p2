import "../styles/Auth.css";

import React, { useState } from "react";

import InputField from "../components/InputField";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // First, authenticate the user by sending username and password
      const res = await axios.post("http://localhost:5000/api/users/login", {
        username,
        password,
      });
  
      localStorage.setItem("token", res.data.token); // Store token
      localStorage.setItem("username", username);
      localStorage.setItem("id", res._id);
  
      // Fetch user role from /get-role route
      const roleRes = await axios.post("http://localhost:5000/api/users/get-role", {
        username,
        password,
      });
  
      // Store the role in localStorage
      localStorage.setItem("role", roleRes.data.role);
  
      // Check role and navigate accordingly
      if (roleRes.data.role === "admin") {
        navigate("/admindash"); // Navigate to admin dashboard if role is admin
      } else {
        navigate("/reguserhome"); // Navigate to Reguserhome if role is user
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed!");
    }
  };
  
  // Function to navigate to GuestHomePage
  const handleGuestLogin = () => {
    localStorage.setItem("username", "Guest");
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleLogin}>
          <InputField
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="auth-button-group">  
            <button className="auth-button" type="submit">
              Login
            </button>
            <button type="button" className="auth-button" onClick={handleGuestLogin}>
              Login as a Guest
            </button>
          </div>
        </form>
        <div className="auth-links">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
