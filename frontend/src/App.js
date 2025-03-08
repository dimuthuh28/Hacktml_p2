import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./Components/AdminLayout";
import PlayersView from "./pages/Admin/PlayersView";
import PlayerStats from "./pages/Admin/PlayerStats";
import TournamentSummary from "./pages/Admin/TournementSummary";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/SignUp";
import ForgotPassword from "./pages/Auth/ForgetPawssword";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="forgotpassword" element={<ForgotPassword/>}/>
        <Route path="/" element={<Login />}>
          <Route path="players" element={<PlayersView />} />
          <Route path="stats" element={<PlayerStats/>}/>
          <Route path="summary" element={<TournamentSummary/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
