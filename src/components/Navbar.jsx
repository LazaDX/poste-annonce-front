// src/components/Navbar.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";
import "./NavbarAdmin.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // Compte des notifications non lues

  // Simuler la récupération des notifications (à remplacer par une API plus tard)
  useEffect(() => {
    const totalUnread = [
      ...[{ read: false }, { read: false }], // Exemple pour newUsers
      ...[{ read: false }, { read: false }], // Exemple pour recentPosts
    ].filter((n) => !n.read).length;
    setUnreadCount(totalUnread);
  }, []);

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
      alert("Déconnexion réussie ! (Simulation)");
      navigate("/login"); // À corriger : pas de page login pour l'instant, tu peux le laisser ou rediriger ailleurs
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <h3>AnnonceMada Admin</h3>
      </div>
      <div className="navbar-right">
        <button className="navbar-icon" onClick={() => navigate("/notifications")} title="Notifications">
          <i className="fas fa-bell"></i>
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>
        <button className="navbar-icon" onClick={toggleTheme} title="Changer de thème">
          <i className={theme === "light" ? "fas fa-moon" : "fas fa-sun"}></i>
        </button>
        <button className="navbar-icon" onClick={() => navigate("/settings")} title="Paramètres">
          <i className="fas fa-cog"></i>
        </button>
        <div className="profile-menu">
          <button className="navbar-icon" onClick={handleProfileToggle} title="Profil">
            <i className="fas fa-user-circle"></i>
          </button>
          {isProfileOpen && (
            <div className="profile-dropdown">
              <button onClick={() => navigate("/profile/edit")}>Modifier le Profil</button>
              <button onClick={() => navigate("/profile/view")}>Voir le Profil</button>
              <button onClick={() => navigate("/add-admin")}>Ajouter Admin</button>
              <button onClick={handleLogout}>Se déconnecter</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;