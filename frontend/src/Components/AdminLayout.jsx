import React from "react";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom"; // This renders the nested routes
import "../styles/AdminLayout.css"
const AdminLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar /> {/* Sidebar on the left */}
      <div style={{ marginLeft: "240px", padding: "20px", flexGrow: 1 }}>
        <Outlet /> {/* This will render the content of the selected route */}
      </div>
    </div>
  );
};

export default AdminLayout;
