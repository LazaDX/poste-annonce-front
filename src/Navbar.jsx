// src/Navbar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handlePublishClick = () => {
    navigate("/user/publication");
  };

  const handleLogoClick = () => {
    navigate("/user/annonces");
  };

  const handleChatClick = () => {
    navigate("/user/chat");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleProfilClick = () => {
    navigate("/user/profil");
  };

  // Données des catégories avec sous-catégories
  const categories = [
    {
      name: "Véhicules",
      icon: "fas fa-car",
      subcategories: [
        "Voitures",
        "Motos",
        "Camions",
        "Pièces & Accessoires",
        "Bateaux",
      ],
    },
    {
      name: "Électronique & Électroménager",
      icon: "fas fa-laptop",
      subcategories: [
        "Téléphones & Tablettes",
        "Ordinateurs",
        "Son, HiFi & Casques",
        "Accessoires Informatiques",
        "TV, Box & Vidéo projecteurs",
        "Appareils photos & Caméras",
        "Montres connectées & GPS",
        "Imprimantes & Photocopieurs",
        "Jeux vidéo & Consoles",
        "Cuisinières, Cazinieres & Fours",
        "Réfrigérateurs & Congélateurs",
        "Climatiseurs & Ventilateurs",
        "Machine à laver vaisselles & Linges",
        "Petit électroménager",
      ],
    },
    {
      name: "Mode, Beauté & Enfant",
      icon: "fas fa-tshirt",
      subcategories: [
        "Vêtements Femme",
        "Vêtements Homme",
        "Chaussures",
        "Accessoires de mode",
        "Produits pour bébé",
      ],
    },
    {
      name: "Services & Emploi",
      icon: "fas fa-briefcase",
      subcategories: [
        "Offres d’emploi",
        "Services à domicile",
        "Formation & Cours",
        "Événements",
      ],
    },
    {
      name: "Maison & Loisirs",
      icon: "fas fa-home",
      subcategories: [
        "Meubles",
        "Décoration",
        "Jardin & Extérieur",
        "Livres & Magazines",
        "Sports & Fitness",
      ],
    },
    {
      name: "Autres",
      icon: "fas fa-ellipsis-h",
      subcategories: ["Divers", "Animaux", "Art & Antiquités"],
    },
  ];

  return (
    <div className="navbar-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo - Navigation vers l'accueil */}
          <div className="logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
            Annonce<span>Mada</span>
          </div>

          {/* Barre de recherche */}
          <div className="search-container">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Chercher sur AnnonceMada" />
          </div>

          {/* Icônes et bouton */}
          <div className="nav-icons">
            <span className="icon">
              <i className="fas fa-heart"></i>
            </span>
            {/* Icône Utilisateur avec navigation vers login */}
            <span className="icon" onClick={handleProfilClick}>
              <i className="fas fa-user"></i>
            </span>
            {/* Icône Chatbot avec navigation */}
            <span className="icon" onClick={handleChatClick}>
              <i className="fas fa-comment"></i>
            </span>
            <button className="publish-btn" onClick={handlePublishClick}>
              <i className="fas fa-bullhorn"></i> Publier une annonce
            </button>
          </div>

          {/* Menu burger */}
          <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={menuOpen ? "toggle-icon active" : "toggle-icon"}></span>
          </div>
        </div>

        {/* Menu mobile */}
        <div className={menuOpen ? "mobile-menu active" : "mobile-menu"}>
          {categories.map((category, index) => (
            <div key={index} className="mobile-menu-item">
              <a href="#" className="mobile-menu-link">
                <i className={category.icon}></i> {category.name}
              </a>
              <div className="mobile-submenu">
                {category.subcategories.map((sub, subIndex) => (
                  <a key={subIndex} href="#" className="mobile-submenu-link">
                    {sub}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <button className="publish-btn" onClick={handlePublishClick}>
            <i className="fas fa-bullhorn"></i> Publier une annonce
          </button>
        </div>

        {/* Menu principal avec sous-menus */}
        <div className="nav-links">
          {categories.map((category, index) => (
            <div key={index} className="nav-link-item">
              <a href="#" className="nav-link">
                <i className={category.icon}></i> {category.name}
              </a>
              <div className="submenu">
                <div className="submenu-container">
                  {category.subcategories.map((sub, subIndex) => (
                    <a key={subIndex} href="#" className="submenu-link">
                      {sub}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}