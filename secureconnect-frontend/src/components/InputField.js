import React from "react";

const InputField = ({ type, placeholder, value, onChange, error }) => {
  return (
    <div>
      <input
        className="auth-input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default InputField;
