import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./favoris.css";

const Favoris = () => {
  // États et navigation
  const [activeTab, setActiveTab] = useState("favoris");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoadMore, setShowLoadMore] = useState(true);

  // États pour données dynamiques
  const [savedAnnonces, setSavedAnnonces] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    keyword: "",
    category: "",
    maxPrice: "",
  });
  const [userData, setUserData] = useState(null);

  // Constantes pour l'URL de base et image par défaut
  const baseUrl = "http://localhost:8000/";
  const defaultImage = "images/default.jpg";

  // Récupération de l'ID utilisateur depuis le localStorage
  const userId = localStorage.getItem("userId");

  // Récupération du profil utilisateur
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8000/api/users/${userId}`, { withCredentials: true })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) =>
          console.error("Erreur lors de la récupération du profil utilisateur", error)
        );
    }
  }, [userId]);

  // Récupération des annonces publiées par l'utilisateur connecté
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8000/api/posts/`, { withCredentials: true })
        .then((response) => {
          const allPosts = response.data;
          const userPosts = allPosts.filter(
            (post) => post.user_id === parseInt(userId, 10)
          );
          setSavedAnnonces(userPosts);
        })
        .catch((error) =>
          console.error("Erreur lors de la récupération des annonces", error)
        );
    }
  }, [userId]);

  // Récupération des favoris de l'utilisateur connecté
  useEffect(() => {
    if (userId) {
      axios
        .get("http://localhost:8000/api/user/favorites/posts", { withCredentials: true })
        .then((response) => {
          const posts = response.data.posts || [];
          setFavoriteItems(posts);
        })
        .catch((error) =>
          console.error("Erreur lors de la récupération des favoris", error)
        );
    }
  }, [userId]);

  // Navigation
  const handleProfileClick = () => {
    navigate("/user/profil");
  };

  const handleAvatarClick = () => {
    navigate("/user/profil");
  };

  const handleItemClick = (id) => {
    navigate(`/user/informations/${id}`);
  };

  const handleImageClick = (image) => {
    alert(`Agrandir l'image ${image} (Simulation)`);
  };

  // Suppression d'un élément (Annonce ou Favori)
  const removeItem = (id, type) => {
    if (window.confirm(`Voulez-vous vraiment supprimer ${type} ${id} ?`)) {
      if (type === "Annonce") {
        axios
          .delete(`http://localhost:8000/api/posts/${id}`, { withCredentials: true })
          .then(() => {
            setSavedAnnonces(savedAnnonces.filter((item) => item.id !== id));
          })
          .catch((error) =>
            console.error("Erreur lors de la suppression de l'annonce", error)
          );
      } else if (type === "Favori") {
        // Supprimer le favori en utilisant l'ID du post
        axios
          .delete(`http://localhost:8000/api/favorites/post/${id}`, { withCredentials: true })
          .then(() => {
            setFavoriteItems(favoriteItems.filter((item) => item.id !== id));
          })
          .catch((error) =>
            console.error("Erreur lors de la suppression du favori", error)
          );
      }
    }
  };

  // Gestion du formulaire pour créer une nouvelle alerte
  const handleAlertChange = (e) => {
    setNewAlert({ ...newAlert, [e.target.name]: e.target.value });
  };

  // Simulation de chargement de plus d'éléments (pagination)
  const loadMore = () => {
    setShowLoadMore(false);
    alert("Charger plus d'éléments (Simulation)");
  };

  // Filtrage des données en fonction de la barre de recherche
  const filteredAnnonces = savedAnnonces.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredFavorites = favoriteItems.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredAlerts = alerts.filter((alert) =>
    alert.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour formater une date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fonction pour calculer le nombre de jours d'inscription
  const getMembershipDays = (createdAt) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - createdDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="favoris-container">
      {/* Section Profil */}
      <div className="profile-section">
        <div className="profile-avatar-wrapper" onClick={handleAvatarClick}>
          <div className="profile-avatar">
            <i className="fas fa-user"></i>
          </div>
          <div className="avatar-glow"></div>
        </div>
        <div className="profile-info">
          <h2>{userData ? userData.first_name : "Chargement..."}</h2>
          <p>
            <i className="fas fa-map-marker-alt"></i>{" "}
            {userData && userData.location
              ? userData.location
              : "Localisation non renseignée"}{" "}
            • Membre depuis{" "}
            {userData && userData.created_at
              ? getMembershipDays(userData.created_at)
              : 0}{" "}
            jours
          </p>
          <div className="profile-actions">
            <button className="profile-btn" onClick={handleProfileClick}>
              <i className="fas fa-cog"></i> Modifier mon profil
            </button>
            <button className="pro-btn">
              <i className="fas fa-crown"></i> Pro Suivis • 0
            </button>
          </div>
        </div>
        <div className="profile-stats">
          <p>Annonces: {savedAnnonces.length}</p>
          <p>Favoris: {favoriteItems.length}</p>
        </div>
      </div>

      {/* Onglets et barre de recherche */}
      <div className="tabs-section">
        <input
          type="text"
          className="search-bar"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="tabs">
          <button
            className={`tab ${activeTab === "annonces" ? "active" : ""}`}
            onClick={() => setActiveTab("annonces")}
          >
            <i className="fas fa-bullhorn"></i> Annonces
          </button>
          <button
            className={`tab ${activeTab === "favoris" ? "active" : ""}`}
            onClick={() => setActiveTab("favoris")}
          >
            <i className="fas fa-heart"></i> Favoris
          </button>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="tab-content">
        <div className={`tab-panel ${activeTab === "annonces" ? "active" : ""}`}>
          {filteredAnnonces.length > 0 ? (
            <div className="items-list">
              {filteredAnnonces.map((item) => {
                const imageRelativePath =
                  item.images && item.images.length > 0
                    ? item.images[0].image || item.images[0].image_path
                    : null;
                const imageUrl = imageRelativePath
                  ? baseUrl + imageRelativePath
                  : defaultImage;

                return (
                  <div key={item.id} className="item-card">
                    <img src={imageUrl} alt={item.title} className="item-image" />
                    <div className="item-details">
                      <h3 onClick={() => handleItemClick(item.id)}>
                        {item.title}
                      </h3>
                      <p className="item-price">{item.title_price}</p>
                      <p className="item-location">{item.location}</p>
                      <p className="item-description">{item.description}</p>
                      <p className="item-date">Créé le {formatDate(item.created_at)}</p>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.id, "Annonce")}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                );
              })}
              {showLoadMore && (
                <button className="load-more-btn" onClick={loadMore}>
                  Charger plus
                </button>
              )}
            </div>
          ) : (
            <div className="content-placeholder">
              <i className="fas fa-bullhorn placeholder-icon"></i>
              <p>Vous n’avez aucune annonce publiée.</p>
              <button className="action-btn" onClick={() => navigate("/publication")}>
                Publier une annonce
              </button>
            </div>
          )}
        </div>

        {/* Bloc Favoris */}
        <div className={`tab-panel ${activeTab === "favoris" ? "active" : ""}`}>
          {filteredFavorites.length > 0 ? (
            <div className="items-list">
              {filteredFavorites.map((item) => {
                const imageRelativePath =
                  item.images && item.images.length > 0
                    ? item.images[0].image || item.images[0].image_path
                    : null;
                const imageUrl = imageRelativePath
                  ? baseUrl + imageRelativePath
                  : defaultImage;

                return (
                  <div key={item.id} className="item-card">
                    <img src={imageUrl} alt={item.title} className="item-image" />
                    <div className="item-details">
                      <h3 onClick={() => handleItemClick(item.id)}>
                        {item.title}
                      </h3>
                      <p className="item-price">{item.title_price}</p>
                      <p className="item-location">{item.location}</p>
                      <p className="item-description">{item.description}</p>
                      <p className="item-date">Créé le {formatDate(item.created_at)}</p>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.id, "Favori")}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                );
              })}
              {showLoadMore && (
                <button className="load-more-btn" onClick={loadMore}>
                  Charger plus
                </button>
              )}
            </div>
          ) : (
            <div className="content-placeholder">
              <i className="fas fa-heart placeholder-icon"></i>
              <p>Vous n’avez aucun favori enregistré.</p>
              <button className="action-btn" onClick={() => navigate("/")}>
                Explorer des annonces
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recommandations */}
      <div className="recommendations-section">
        <h3>Recommandations</h3>
        <p>Explorez ces annonces populaires :</p>
        <div className="recommendations-list">
          <div className="recommendation-card">
            <img src="images/image1.jpg" alt="Recommandation" className="rec-image" />
            <p>Voiture neuve - Renault Duster</p>
            <p>18 000 000 Ar</p>
          </div>
          <div className="recommendation-card">
            <img src="images/image1.jpg" alt="Recommandation" className="rec-image" />
            <p>Télévision LED 50 pouces</p>
            <p>1 500 000 Ar</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favoris;