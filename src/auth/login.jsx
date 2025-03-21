// src/auth/login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import axios from "axios";
import AuthNavbar from "../AuthNavbar";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true,
      });
      console.log('CSRF Cookie récupéré');

      // Envoyer la requête de login
      const response = await axios.post(
        'http://localhost:8000/api/auth/login',
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      //console.log("Connexion réussie :", response.data);
      localStorage.setItem("isAuthenticated", "true");

      // Récupérer et stocker l'ID de l'utilisateur
      // On vérifie si l'ID est dans response.data.user ou directement dans response.data
      const adminId = response.data.admin?.id || response.data.id;
      const userId = response.data.user?.id || response.data.id;

      if (userId) {
        localStorage.setItem("userId", userId);
      } else if (adminId) {
        localStorage.setItem("adminId", adminId);
      } else {
        console.warn("ID utilisateur non trouvé dans la réponse");
      }

      // Stocker le type d'utilisateur
      if (response.data.admin) {
        localStorage.setItem("userType", "admin");
        navigate('/admin/dashboard')
      } else {
        localStorage.setItem("userType", "user");
        navigate('/user/annonces');
      }

      // Rediriger vers /user/annonces quel que soit le type d'utilisateur


    } catch (err) {
      console.error("Erreur lors de la connexion :", err);
      setError("Erreur de connexion. Vérifie tes identifiants.");
    }
  };

  return (
    <>
      <AuthNavbar />
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Connexion</h2>
          {error && <p className="login-error">{error}</p>}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                required
              />
            </div>
            <div className="form-group">
              <label>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>
            <button type="submit" className="login-btn">
              Se connecter
            </button>
          </form>
          <p className="login-link">
            Pas encore inscrit ? <Link to="/inscription">Inscrivez-vous</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;