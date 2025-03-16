// src/AuthNavbar.jsx
import { useNavigate } from "react-router-dom";
import "./AuthNavbar.css";

export default function AuthNavbar() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="auth-navbar-wrapper">
      <nav className="auth-navbar">
        <div className="auth-navbar-container">
          {/* Logo - Navigation vers l'accueil */}
          <div className="logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
            Annonce<span>Mada</span>
          </div>
        </div>
      </nav>
    </div>
  );
}