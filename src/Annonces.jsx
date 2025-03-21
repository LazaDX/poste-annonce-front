// src/Annonces.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Annonces.css";
import image2 from "./assets/i.jpg";
import Swal from "sweetalert2";

const baseUrl = "http://localhost:8000/";

const Annonces = () => {
  // États pour gérer les likes, les posts, le chargement et les erreurs
  const [likes, setLikes] = useState(new Set());
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Récupération des posts depuis l'API Laravel
  useEffect(() => {
    // Remplace l'URL par celle de ton backend
    axios
      .get("http://localhost:8000/api/posts")
      .then((response) => {
        setAnnonces(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des posts :", err);
        setError("Erreur lors de la récupération des posts");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated) {
      axios
        .get("http://localhost:8000/api/user/favorites/posts", {
          withCredentials: true,
          headers: { Accept: "application/json" },
        })
        .then((response) => {
          const posts = response.data.posts || [];
          const favoriteIds = new Set(posts.map((post) => post.id));
          setLikes(favoriteIds);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des favoris :", error);
        });
    }
  }, []);

  const handleFavoriteClick = (postId) => {
    Swal.fire({
      title: "Ajouter aux favoris ?",
      text: "Voulez-vous vraiment ajouter cet article à vos favoris ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, ajouter !",
      cancelButtonText: "Non, annuler",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        toggleLike(postId);
        const userId = localStorage.getItem("userId");
        if (!userId) {
          Swal.fire("Erreur", "Vous devez être connecté pour ajouter un favori", "error");
          return;
        }
        axios
          .post("http://localhost:8000/api/favorites", {
            user_id: parseInt(userId, 10),
            post_id: postId,
          }, { WithCredentials: true })
          .then(() => {
            Swal.fire("Favori ajouté !", "L'article a été ajouté à vos favoris.", "success");
          })
          .catch((error) => {
            console.error("Erreur lors de l'ajout du favori :", error);
            Swal.fire("Erreur", "Une erreur est survenue lors de l'ajout du favori", "error");
          });
      }
      // Si l'utilisateur annule, on ne fait rien, et la classe "active" n'est pas activée
    });
  };


  const toggleLike = (id) => {

    // handleAddFavorite(id);

    const newLikes = new Set(likes);
    if (newLikes.has(id)) {
      newLikes.delete(id);
    } else {
      newLikes.add(id);
    }
    setLikes(newLikes);
  };

  // Navigation vers les détails d'un post
  const handleImageClick = (id) => {
    navigate(`/user/informations/${id}`);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="annonces-container">
      {/* Barre latérale des filtres */}
      <div className="sidebar">
        <div className="sidebar-title">Filtres</div>
        <div className="filter-section">
          <h4>Catégories</h4>
          <ul className="filter-list">
            <li>
              <label>
                <input type="radio" name="category" /> Véhicules
              </label>
            </li>
            <li>
              <label>
                <input type="radio" name="category" /> Électronique
              </label>
            </li>
            <li>
              <label>
                <input type="radio" name="category" /> Immobilier
              </label>
            </li>
          </ul>
        </div>
        <div className="filter-section">
          <h4>Prix</h4>
          <ul className="filter-list">
            <li>
              <label>
                <input type="radio" name="price" /> 0 - 10M Ar
              </label>
            </li>
            <li>
              <label>
                <input type="radio" name="price" /> 10M - 50M Ar
              </label>
            </li>
            <li>
              <label>
                <input type="radio" name="price" /> 50M+ Ar
              </label>
            </li>
          </ul>
        </div>
        <div className="filter-section">
          <h4>Localisation</h4>
          <div className="search-location">
            <input type="text" placeholder="Rechercher une ville..." />
            <i className="fas fa-search"></i>
          </div>
        </div>
      </div>

      {/* Affichage des annonces */}
      <div className="annonces">
        <div className="categories">
          <h3>Catégories populaires</h3>
          <div className="category-tags">
            <span className="tag">Maisons</span>
            <span className="tag">Voitures</span>
            <span className="tag">Électronique</span>
            <span className="tag">Emploi</span>
          </div>
        </div>

        {annonces.map((annonce) => {
          const imageRelativePath =
            annonce.images && annonce.images.length > 0
              ? annonce.images[0].image
              : null;
          const imageUrl = imageRelativePath ? baseUrl + imageRelativePath : image2;
          const categoryName = annonce.category ? annonce.category.name : "Non catégorisé";

          return (
            <div key={annonce.id} className="annonce-card">
              <div className="card-image">
                <img
                  src={imageUrl}
                  alt={annonce.title}
                  onClick={() => handleImageClick(annonce.id)}
                  style={{ cursor: "pointer" }}
                />
                <button
                  className={`like-btn ${likes.has(annonce.id) ? "active" : ""}`}
                  onClick={() => {
                    // toggleLike(annonce.id)
                    handleFavoriteClick(annonce.id)
                  }}
                >
                  <i className="fas fa-heart"></i>
                </button>
              </div>
              <div className="card-content">
                <div className="price">{annonce.title_price} Ar</div>
                <div className="title">{annonce.title}</div>
                <div className="location">{annonce.location}</div>
                <div className="category">
                  <span className="category-label">Catégorie :</span>{" "}
                  {categoryName}
                </div>
                <div className="condition">
                  <span className="condition-label">État :</span> {annonce.condition}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Annonces;
