import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";
import GuestHomePage from "./pages/GuestHomePage";
import Login from "./pages/Login";
import PlayerStatsView from "./pages/Admin/PlayerStats";
import PlayersView from "./pages/Admin/PlayersView";
import React from "react";
import Reguserhome from "./pages/Reguserhome";
import Signup from "./pages/Signup";
import TournamentSummary from "./pages/Admin/TournementSummary";
import SpiriterChat from "./components/spiriterChat";
import Navbar_u from "./components/Navbar-u";
import UserDashboard from "./pages/Dashboard";
import TeamSelection from "./components/TeamSelection";
import Leaderboard from "./components/Leaderboard";

function App() {
  return (
    <Router>
      <Navbar_u />

      <Routes>
        <Route path="/" element={<GuestHomePage />} />
        <Route path="/spiriter" element={<SpiriterChat />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/Team" element={<TeamSelection />} />
        <Route path="/Leaderboard" element={<Leaderboard />} />

        {/* After login, the user will be redirected */}
        <Route path="/reguserhome" element={<Reguserhome />} />

        {/* Admin route layout */}
        <Route path="/admindash" element={<AdminLayout />}>
          {/* The default route inside AdminLayout */}
          <Route index element={<div><h1>Admin Dashboard</h1><p>Welcome to the admin dashboard.</p></div>} /> 
          <Route path="players" element={<PlayersView />} />
          <Route path="stats" element={<PlayerStatsView />} />
          <Route path="summary" element={<TournamentSummary />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
