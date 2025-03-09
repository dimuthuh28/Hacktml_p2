import React, { useState } from "react";
import "../../styles/Signup.css"; // Import the external CSS file

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    // Add signup logic here (e.g., API call to register user)
    console.log("Signing up with:", email, password);
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="signup-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="signup-input"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="signup-input"
      />
      <button onClick={handleSignup} className="signup-button">
        Signup
      </button>
    </div>
  );
};

export default Signup;
