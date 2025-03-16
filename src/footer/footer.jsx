import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Section Marque */}
        <div className="footer-section footer-brand">
          <h3 className="footer-logo">
            <span className="logo-gradient">AnnonceMada</span>
          </h3>
          <p className="footer-tagline">Votre marché en ligne en Afrique</p>
          <div className="footer-social">
            <a href="#" className="social-icon" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-icon" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
          </div>
        </div>

        {/* Sections répétitives avec données dynamiques */}
        {footerSections.map((section, index) => (
          <div className="footer-section" key={index}>
            <h3 className="section-title">
              <span className="title-decoration"></span>
              {section.title}
            </h3>
            <ul>
              {section.links.map((link, idx) => (
                <li key={idx}>
                  <a href={link.url} className="hover-effect">
                    <i className={`fas fa-${link.icon} link-icon`}></i>
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Sélecteur de pays */}
        <div className="footer-section">
          <h3 className="section-title">
            <span className="title-decoration"></span>
            Changer de pays
          </h3>
          <div className="select-wrapper">
            <select className="footer-select">
              {countries.map((country, index) => (
                <option value={country.value} key={index}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section Apps */}
        <div className="footer-section footer-community-section">
            <h3 className="section-title">
                <span className="title-decoration"></span>
                Rejoignez notre communauté
            </h3>
            <div className="community-actions">
                <a href="#" className="cta-button cta-primary">
                S'inscrire maintenant
                </a>
                <a href="#" className="cta-button cta-secondary">
                En savoir plus
                </a>
            </div>
        </div>
      </div>

      {/* Bas de footer */}
      <div className="footer-bottom">
        <p className="footer-copy">
          © 2017 - 2025 AnnonceMada. Tous droits réservés.
          <span className="legal-links">
            <a href="#">Confidentialité</a> | <a href="#">Conditions</a>
          </span>
        </p>
      </div>
    </footer>
  );
};

// Données pour le contenu dynamique
const footerSections = [
    {
      title: "À propos",
      links: [
        { text: "Qui sommes-nous ?", url: "/about", icon: "info-circle" },
        { text: "Notre équipe", url: "/team", icon: "users" },
        { text: "Carrières", url: "/careers", icon: "briefcase" },
        { text: "Blog & Actualités", url: "/blog", icon: "newspaper" },
        { text: "Impact social", url: "/social-impact", icon: "hand-holding-heart" }
      ]
    },
    {
      title: "Légal",
      links: [
        { text: "Conditions générales", url: "/terms", icon: "balance-scale" },
        { text: "Politique de confidentialité", url: "/privacy", icon: "lock" },
        { text: "Cookies", url: "/cookies", icon: "cookie-bite" },
        { text: "RGPD", url: "/gdpr", icon: "shield-alt" },
        { text: "Mentions légales", url: "/legal", icon: "gavel" }
      ]
    },
    {
      title: "Catégories",
      links: [
        { text: "Immobilier", url: "/real-estate", icon: "building" },
        { text: "Véhicules", url: "/vehicles", icon: "car" },
        { text: "Emploi", url: "/jobs", icon: "user-tie" },
        { text: "Électronique", url: "/electronics", icon: "mobile-alt" },
        { text: "Mode & Accessoires", url: "/fashion", icon: "tshirt" }
      ]
    },
    {
      title: "Support",
      links: [
        { text: "Centre d'aide", url: "/help", icon: "question-circle" },
        { text: "Contact", url: "/contact", icon: "envelope" },
        { text: "FAQ", url: "/faq", icon: "comments" },
        { text: "Sécurité", url: "/safety", icon: "user-shield" },
        { text: "Guide d'achat", url: "/guide", icon: "book-open" }
      ]
    }
  ];
  
  const countries = [
    { 
      value: "mg", 
      label: "🇲🇬 Madagascar - Antananarivo",
      region: "Afrique de l'Est" 
    },
    { 
      value: "fr", 
      label: "🇫🇷 France - Paris",
      region: "Europe" 
    },
    { 
      value: "sn", 
      label: "🇸🇳 Sénégal - Dakar",
      region: "Afrique de l'Ouest" 
    },
    { 
      value: "ci", 
      label: "🇨🇮 Côte d'Ivoire - Abidjan",
      region: "Afrique de l'Ouest" 
    },
    { 
      value: "ca", 
      label: "🇨🇦 Canada - Montréal",
      region: "Amérique du Nord" 
    }
  ];

export default Footer;