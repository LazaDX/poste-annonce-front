// src/components/Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
      alert("Déconnexion réussie ! (Simulation)");
      navigate("/login");
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Admin Panel</h3>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className="sidebar-link" end>
          <i className="fas fa-tachometer-alt"></i> Dashboard
        </NavLink>
        <NavLink to="/users" className="sidebar-link">
          <i className="fas fa-users"></i> Utilisateurs
        </NavLink>
        <NavLink to="/transactions" className="sidebar-link">
          <i className="fas fa-money-check-alt"></i> Transactions
        </NavLink>
        <NavLink to="/annonces" className="sidebar-link">
          <i className="fas fa-bullhorn"></i> Annonces
        </NavLink>
        <NavLink to="/settings" className="sidebar-link">
          <i className="fas fa-cog"></i> Paramètres
        </NavLink>
      </nav>
      <button className="sidebar-logout" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i> Se déconnecter
      </button>
    </div>
  );
};

export default Sidebar;