// src/bannier/bannier.jsx
import React, { useState, useEffect } from "react";
import "./bannier.css";

const Bannier = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Données des slides pour la bannière
  const slides = [
    {
      image: "/images/image1.jpg", // Ajusté pour utiliser un chemin public
      background: "linear-gradient(135deg, #6f42c1, #8e44ad)",
      titleLeft: "Négociation suspecte ?",
      subtitleLeft: "Voiture bien en dessous du prix standard ?",
      infoLeft: "Données bancaires douteuses ?",
      titleRight: "Attention !",
      subtitleRight: "Il pourrait s'agir d'une arnaque",
      infoRight: "Via un faux intermédiaire.",
      buttonText: "En savoir plus",
    },
    {
      image: "/images/image2.jpg",
      background: "linear-gradient(135deg, #e74c3c, #c0392b)",
      titleLeft: "Offre trop belle ?",
      subtitleLeft: "Prix inhabituellement bas ?",
      infoLeft: "Vérifiez les détails !",
      titleRight: "Protégez-vous",
      subtitleRight: "Évitez les escroqueries",
      infoRight: "Contactez le support si besoin.",
      buttonText: "Obtenir de l'aide",
    },
    {
      image: "/images/image3.jpg",
      background: "linear-gradient(135deg, #27ae60, #2ecc71)",
      titleLeft: "Transaction sécurisée ?",
      subtitleLeft: "Paiement en ligne suspect ?",
      infoLeft: "Utilisez des méthodes fiables.",
      titleRight: "Sûreté d'abord",
      subtitleRight: "Choisissez des vendeurs vérifiés",
      infoRight: "Garantie de confiance.",
      buttonText: "Découvrir plus",
    },
  ];

  // Fonctions pour le carrousel
  const nextSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="banner" style={{ background: currentSlide.background }}>
      <div className="banner-container">
        <div className="banner-content left-content">
          <h1>{currentSlide.titleLeft}</h1>
          <h2>{currentSlide.subtitleLeft}</h2>
          <p>{currentSlide.infoLeft}</p>
        </div>
        <div className="banner-image">
          <img
            src={currentSlide.image}
            alt="Bannière promotionnelle"
            className="carousel-image"
          />
        </div>
        <div className="banner-content right-content">
          <h1>{currentSlide.titleRight}</h1>
          <h2>{currentSlide.subtitleRight}</h2>
          <p>{currentSlide.infoRight}</p>
          <button className="banner-btn">{currentSlide.buttonText}</button>
        </div>
      </div>
      <div className="banner-navigation">
        <button className="nav-arrow left-arrow" onClick={prevSlide}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="nav-arrow right-arrow" onClick={nextSlide}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Bannier;