
import React, { useState, useEffect } from "react";
import "./informations.css";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import { motion } from "framer-motion";
import axios from "axios";

const baseUrl = "http://localhost:8000/";

const Informations = () => {
  const { id } = useParams();
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(0);
  const [message, setMessage] = useState("");
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Récupération des données détaillées du post depuis le backend
  useEffect(() => {
    axios
      .get(`${baseUrl}api/posts/${id}`)
      .then((response) => {
        setAnnonce(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des détails du post:", err);
        setError("Erreur lors de la récupération des détails du post");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (annonce && annonce.images && annonce.images.length > 0) {
      setMainImage(0);
    }
  }, [annonce]);

  const handlePrevImage = () => {
    setMainImage((prev) =>
      prev > 0 ? prev - 1 : annonce.images.length - 1
    );
  };

  const handleNextImage = () => {
    setMainImage((prev) =>
      prev < annonce.images.length - 1 ? prev + 1 : 0
    );
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const shareVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log(`Message envoyé à ${annonce.user.first_name} ${annonce.user.last_name}: ${message}`);
      setMessage("");
    }
  };

  const toggleShareMenu = () => {
    setIsShareOpen(!isShareOpen);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (!annonce) {
    return <div>Aucune annonce trouvée.</div>;
  }

  const shareUrl = window.location.href;

  return (
    <div className="informations-page">
      <Navbar />
      <motion.div className="info-content" initial="hidden" animate="visible" variants={fadeIn}>
        <motion.div className="product-header" variants={fadeInUp}>
          <div className="breadcrumbs">
            <a href="/">Accueil</a> <span className="separator">{">"}</span>{" "}
            <a href="/annonces">Annonces</a> <span className="separator">{">"}</span>{" "}
            <a href={`/annonces/${annonce.location}`}>{annonce.location}</a>{" "}
            <span className="separator">{">"}</span> {annonce.title}
          </div>
        </motion.div>

        <motion.div className="product-details" variants={fadeInUp}>
          <div className="product-images">
            <button className="nav-btn prev" onClick={handlePrevImage} disabled={annonce.images.length <= 1}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <motion.img
              // On vérifie que l'objet image existe et on concatène avec baseUrl
              src={
                annonce.images[mainImage] && annonce.images[mainImage].image
                  ? baseUrl + annonce.images[mainImage].image
                  : "/images/default.jpg"
              }
              alt={annonce.title}
              className="main-product-image"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            />
            <button className="nav-btn next" onClick={handleNextImage} disabled={annonce.images.length <= 1}>
              <i className="fas fa-chevron-right"></i>
            </button>
            <div className="thumbnail-gallery">
              {annonce.images.map((imgObj, index) => (
                <img
                  key={index}
                  // Pour chaque vignette, on utilise aussi le chemin complet
                  src={imgObj.image ? baseUrl + imgObj.image : "/images/default.jpg"}
                  alt={`Thumbnail ${index}`}
                  className={`thumbnail ${mainImage === index ? "active" : ""}`}
                  onClick={() => setMainImage(index)}
                />
              ))}
            </div>
          </div>


          <div className="product-info">
            <h1 className="product-title">{annonce.title}</h1>
            <div className="price-section">
              <span className="product-price">{annonce.price}</span>
              <span className="vat-info">(No VAT)</span>
            </div>
            <div className="seller-info">
              <div className="seller-profile">
                <img
                  src={annonce.sellerAvatar}
                  alt={`${annonce.user.first_name} ${annonce.user.last_name}`}
                  className="seller-mini-avatar"
                />
                <div>
                  <span className="seller-name">
                    {annonce.user.first_name} {annonce.user.last_name}
                  </span>
                  <span className="seller-posting">{annonce.daysAgo} ago</span>
                </div>
              </div>
              <a href="#" className="see-ads-link">
                See all ads
              </a>
            </div>
            <div className="contact-section">
              <form onSubmit={handleSendMessage} className="message-form">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Salut ${annonce.user.first_name}, je suis intéressé(e) par votre annonce. Est-ce toujours disponible ? Merci !`}
                  className="message-input"
                />
                <button type="submit" className="send-message-btn">
                  <i className="fas fa-paper-plane"></i> Envoyer
                </button>
              </form>
              <div className="actions">
                <button className="favourite-btn">
                  <i className="fas fa-heart"></i> Favoris
                </button>
                <button className="report-btn">
                  <i className="fas fa-flag"></i> Signaler
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className="additional-info-section" variants={fadeInUp}>
          <div className="description-section">
            <h3>Description</h3>
            <div className="description-card">
              <p>{annonce.description}</p>
              <div className="description-highlights">
                <span className="highlight-tag">{annonce.category.name}</span>
                <span className="highlight-tag">{annonce.condition}</span>
                {/* {annonce.warranty !== "N/A" && (
                  <span className="highlight-tag">{annonce.warranty}</span>
                )} */}
              </div>
            </div>
          </div>
          <div className="criteria-section">
            <h3>Critères</h3>
            <div className="criteria-grid">
              <div className="criteria-item">
                <span className="criteria-label">
                  <i className="fas fa-bicycle"></i>{annonce.category.name}
                </span>
                <span className="criteria-value"></span>
              </div>
              <div className="criteria-item">
                <span className="criteria-label">
                  <i className="fas fa-check-circle"></i>{annonce.condition}
                </span>
              </div>
              {/* <div className="criteria-item">
                <span className="criteria-label">
                  <i className="fas fa-clock"></i> Garantie
                </span>
                <span className="criteria-value">{annonce.warranty}</span>
              </div> */}
              <div className="criteria-item">
                <span className="criteria-label">
                  <i className="fas fa-map-marker-alt"></i>{annonce.location}
                </span>
              </div>
            </div>
          </div>
          <div className="seller-details">
            <h3>À propos du vendeur</h3>
            <div className="seller-profile-header">
              <img
                src={annonce.sellerAvatar}
                alt={`${annonce.user.first_name} ${annonce.user.last_name}`}
                className="seller-avatar"
              />
              <div className="seller-info-details">
                <span className="seller-name">
                  {annonce.user.first_name} {annonce.user.last_name}
                </span>
                <span className="seller-type">{annonce.sellerType}</span>
                <span className="seller-since">Membre depuis {annonce.sellerSince}</span>
                <span className="seller-ads-count">{annonce.sellerAdsCount} annonces</span>
                {annonce.sellerVerified && (
                  <span className="verified-badge">
                    <i className="fas fa-check-circle"></i> Vérifié
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="contact-links">
            <h3>Contacter le vendeur</h3>
            <div className="contact-bar">
              {annonce.whatsapp && (
                <a
                  href={`https://wa.me/${annonce.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-btn whatsapp"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
              )}
              {annonce.facebook && (
                <a
                  href={annonce.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-btn facebook"
                >
                  <i className="fab fa-facebook"></i>
                </a>
              )}
              {annonce.instagram && (
                <a
                  href={annonce.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-btn instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {annonce.twitter && (
                <a
                  href={annonce.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-btn twitter"
                >
                  <i className="fab fa-twitter"></i>
                </a>
              )}
              {annonce.email && (
                <a href={`mailto:${annonce.email}`} className="contact-btn email">
                  <i className="fas fa-envelope"></i>
                </a>
              )}
              <div className="share-section">
                <button className="contact-btn share-btn" onClick={toggleShareMenu}>
                  <i className="fas fa-share-alt"></i>
                </button>
                {isShareOpen && (
                  <motion.div
                    className="share-menu"
                    variants={shareVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <a
                      href={`https://wa.me/?text=Regarde cette annonce : ${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-option whatsapp"
                    >
                      <i className="fab fa-whatsapp"></i> WhatsApp
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-option facebook"
                    >
                      <i className="fab fa-facebook"></i> Facebook
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=Regarde cette annonce !`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-option twitter"
                    >
                      <i className="fab fa-twitter"></i> Twitter
                    </a>
                    <a
                      href={`mailto:?subject=Regarde cette annonce&body=${shareUrl}`}
                      className="share-option email"
                    >
                      <i className="fas fa-envelope"></i> Email
                    </a>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Informations;
