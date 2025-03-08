import React, { useState } from "react";
import "../../styles/ForgotPassword.css"; // Import external CSS

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    // Add logic to send reset password email
    console.log("Resetting password for:", email);
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="forgot-password-input"
      />
      <button onClick={handleResetPassword} className="forgot-password-button">
        Reset Password
      </button>
    </div>
  );
};

export default ForgotPassword;
