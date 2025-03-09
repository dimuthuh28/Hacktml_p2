import React from "react";

const InputField = ({ type, placeholder, value, onChange, error, label }) => {
  return (
    <div className="input-field">
      {label && <label>{label}</label>}
      <input
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
