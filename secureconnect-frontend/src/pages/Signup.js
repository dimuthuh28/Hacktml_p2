import "../styles/Auth.css";

import React, { useState } from "react";

import InputField from "../components/InputField";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/signup", {
        username,
        password,
      });
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Signup</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSignup}>
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
          <InputField
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="auth-button" type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
