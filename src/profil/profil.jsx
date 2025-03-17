import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./profil.css";

const Profil = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const userId = localStorage.getItem("userId");

  // Au montage du composant, on récupère les infos de l'utilisateur
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8000/api/users/${userId}`, { withCredentials: true })
        .then((response) => {
          // On suppose que l'API renvoie les champs first_name, last_name, email et contact
          const { first_name, last_name, email, contact } = response.data;
          setUserData({ first_name, last_name, email, contact });
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données utilisateur :", error);
          Swal.fire("Erreur", "Impossible de récupérer vos informations.", "error");
        });
    }
  }, [userId]);

  // Si les données ne sont pas encore chargées, on affiche un indicateur de chargement
  if (!userData) {
    return <div>Chargement...</div>;
  }

  // Gestion de la modification des inputs
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Gestion du changement d'image et de sa prévisualisation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setProfileImage(null);
      setPreviewImage(null);
    }
  };

  // Soumission du formulaire pour mettre à jour le profil
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("first_name", userData.first_name);
    formData.append("last_name", userData.last_name);
    formData.append("email", userData.email);
    formData.append("contact", userData.contact);
    if (profileImage) {
      formData.append("profile_image", profileImage);
    }

    try {
      const response = await axios.put(`http://localhost:8000/api/users/${userId}`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
      if (response.status === 200) {
        Swal.fire({
          title: "Succès !",
          text: "Votre profil a été mis à jour.",
          icon: "success",
          confirmButtonText: "Ok, Enregistrer",
          cancelButtonText: "Annuler"
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Erreur",
        text:
          error.response && error.response.data.message
            ? error.response.data.message
            : "Une erreur est survenue lors de la mise à jour.",
        icon: "error",
        confirmButtonText: "Ok"
      });
    }
  };

  // Gestion de la déconnexion
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Déconnexion",
      text: "Voulez-vous vraiment vous déconnecter ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, déconnectez-moi !",
      cancelButtonText: "Annuler"
    });

    if (result.isConfirmed) {
      try {
        // Ajout des crédentiels et correction de la configuration axios
        const response = await axios.post(
          "http://localhost:8000/api/auth/logout",
          {}, // Corps de requête vide
          {
            withCredentials: true, // Indispensable pour les cookies de session
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.status === 200) {
          // Suppression du stockage local si nécessaire
          localStorage.removeItem('userId');
          localStorage.removeItem('toke');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userType');
          localStorage.removeItem('isAuthenticated');

          localStorage.removeItem('admin');

          Swal.fire({
            title: "Déconnecté",
            text: response.data.message,
            icon: "success",
            confirmButtonText: "Ok"
          }).then(() => {
            // Redirection et rechargement pour nettoyer l'état
            navigate("/");
            window.location.reload(); // Rafraîchir pour vider le contexte d'authentification
          });
        }
      } catch (error) {
        console.error("Erreur déconnexion:", error.response?.data || error.message);
        Swal.fire({
          title: "Erreur",
          text: error.response?.data?.message || "Erreur lors de la déconnexion.",
          icon: "error",
          confirmButtonText: "Ok"
        });
      }
    }
  };

  // Fonction pour déclencher le sélecteur d'image
  const triggerFileInput = () => {
    document.getElementById("imageInput").click();
  };

  return (
    <div className="profil-container">
      {/* Menu latéral */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Mon Profil</h3>
        </div>
        <button className="sidebar-btn active">
          <i className="fas fa-user"></i> Modifier mon profil
        </button>
        <button className="sidebar-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Se déconnecter
        </button>
      </div>

      {/* Contenu principal */}
      <div className="profil-content">
        <h2>Modifier mon profil</h2>
        <form onSubmit={handleSubmit} className="profil-form">
          <div className="form-group">
            <div className="avatar-section" onClick={triggerFileInput}>
              <div className="avatar">
                {previewImage ? (
                  <img src={previewImage} alt="Prévisualisation" className="avatar-preview" />
                ) : (
                  <i className="fas fa-user"></i>
                )}
                <div className="avatar-glow"></div>
                <div className="edit-icon">
                  <i className="fas fa-camera"></i>
                </div>
              </div>
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <button type="button" className="upload-btn" onClick={triggerFileInput}>
                Importer une photo
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Prénom</label>
            <div className="input-wrapper">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="first_name"
                value={userData.first_name}
                onChange={handleChange}
                placeholder="Entrez votre prénom"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Nom</label>
            <div className="input-wrapper">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="last_name"
                value={userData.last_name}
                onChange={handleChange}
                placeholder="Entrez votre nom"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Contact +261</label>
            <div className="input-wrapper">
              <i className="fas fa-solid fa-phone"></i>
              <input
                type="text"
                name="contact"
                value={userData.contact}
                onChange={handleChange}
                placeholder="0320000000"
                pattern="\d{10}"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Entrez votre email"
              />
            </div>
          </div>
          <button type="submit" className="submit-btn">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profil;
