// src/auth/inscription.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./inscription.css";

const Inscription = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.first_name || !formData.last_name || !formData.email ||
      !formData.contact || !formData.password || !formData.confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/users", {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        contact: formData.contact,
        password: formData.password
      });

      if (response.status === 201) {
        Swal.fire({
          title: "Inscription réussie !",
          text: "Votre compte a été créé avec succès",
          icon: "success",
          confirmButtonText: "OK"
        }).then(() => {
          navigate("/");
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Erreur lors de l'inscription";
      Swal.fire({
        title: "Erreur",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  return (
    <div className="inscription-container">
      <div className="inscription-card">
        <h2 className="inscription-title">Inscription</h2>
        {error && <p className="inscription-error">{error}</p>}
        <form onSubmit={handleSubmit} className="inscription-form">

          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Entrez votre nom"
              required
            />
          </div>
          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Entrez votre prénom"
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
            <label>Téléphone</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Entrez votre numéro de téléphone"
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
              placeholder="Créez un mot de passe"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirmer le mot de passe</label>
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