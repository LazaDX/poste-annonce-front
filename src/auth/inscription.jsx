// src/auth/inscription.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./inscription.css"; // Vérifie que ce chemin est correct

const Inscription = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setError("");
    alert("Inscription réussie ! (Simulation)");
    navigate("/login");
  };

  return (
    <div className="inscription-container">
      <div className="inscription-card">
        <h2 className="inscription-title">Inscription</h2>
        {error && <p className="inscription-error">{error}</p>}
        <form onSubmit={handleSubmit} className="inscription-form">
          <div className="form-group">
            <label>Nom complet</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Entrez votre nom"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Entrez votre email"
              required
            />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirmer mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmez votre mot de passe"
              required
            />
          </div>
          <button type="submit" className="inscription-btn">
            S'inscrire
          </button>
        </form>
        <p className="inscription-link">
          Déjà un compte ? <Link to="/login">Connectez-vous</Link>
        </p>
      </div>
    </div>
  );
};

export default Inscription;