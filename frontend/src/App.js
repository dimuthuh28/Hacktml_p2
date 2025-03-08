import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Admindash from "./pages/Admindash";
import Dashboard from "./pages/Dashboard";
import GuestHomePage from "./pages/GuestHomePage";
import Login from "./pages/Login";
import React from "react";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GuestHomePage />} />
        <Route path="/admindashboard" element={<Admindash />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
