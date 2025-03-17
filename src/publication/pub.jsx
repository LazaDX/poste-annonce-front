import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./pub.css";
import Swal from "sweetalert2";

const Pub = ({ annonceId }) => {
  const navigate = useNavigate();

  // État pour stocker les données du formulaire
  const [formData, setFormData] = useState({
    title: null,
    title_price: null,
    type: "Vente", // Valeur par défaut
    surface: null,
    city: null,
    phone: null,
    whatsapp: null,
    payment_method: "gratuit", // Valeur par défaut
    vitesse: null,
    moteur: null,
    nombre_etages: null,
    nombre_chambres: null,
    nombre_pieces: null,
    type_activite: null,
    nombre_couchages: null,
    commodites: null,
    location: null,
    condition: null,
    type_culture: null,
    equipements: null,
    type_exploitation: null,
    description: null,
    user_id: localStorage.getItem("userId") || null, // Récupération depuis localStorage
    category_id: null,
  });

  // État pour gérer les photos et les inputs d'upload
  const [photos, setPhotos] = useState([]);
  const [photoInputs, setPhotoInputs] = useState([1]); // Gère les inputs (max 4)
  const [selectedCategory, setSelectedCategory] = useState(""); // Catégorie sélectionnée

  // Charger les données existantes si un annonceId est fourni
  useEffect(() => {
    if (annonceId) {
      fetch(`/api/annonces/${annonceId}`)
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            title: data.title | "",
            title_price: data.title_price | "",
            type: data.type | "Vente",
            surface: data.surface | "",
            city: data.city | "",
            phone: data.phone | "",
            whatsapp: data.whatsapp | "",
            payment_method: data.payment_method | "gratuit",
            vitesse: data.vitesse | "",
            moteur: data.moteur | "",
            nombre_etages: data.nombre_etages | "",
            nombre_chambres: data.nombre_chambres | "",
            nombre_pieces: data.nombre_pieces | "",
            type_activite: data.type_activite | "",
            nombre_couchages: data.nombre_couchages | "",
            commodites: data.commodites | "",
            location: data.location | "",
            condition: data.condition | "",
            type_culture: data.type_culture | "",
            equipements: data.equipements | "",
            type_exploitation: data.type_exploitation | "",
            description: data.description | "",
            user_id: localStorage.getItem("userId") | data.user_id | "",
            category_id: data.category_id | "",
          });
          setSelectedCategory(data.category_id | "");
        })
        .catch((error) =>
          console.error("Erreur lors du fetch des données:", error)
        );
    }
  }, [annonceId]);

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Gestion du changement de catégorie
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setFormData((prevData) => ({
      ...prevData,
      category_id: categoryId,
      surface: "",
      vitesse: "",
      moteur: "",
      nombre_etages: "",
      nombre_chambres: "",
      nombre_pieces: "",
      type_activite: "",
      nombre_couchages: "",
      commodites: "",
      type_culture: "",
      equipements: "",
      type_exploitation: "",
    }));
  };

  // Gestion de l'upload des photos
  const handlePhotoUpload = (e, index) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length <= 4) {
      const newPhotos = [...photos];
      files.forEach((file) => {
        newPhotos.push(file);
      });
      setPhotos(newPhotos);

      // Ajouter un nouvel input si moins de 4 photos et moins de 4 inputs
      if (newPhotos.length < 4 && photoInputs.length < 4) {
        setPhotoInputs([...photoInputs, photoInputs.length + 1]);
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Limite atteinte",
        text: "Vous ne pouvez uploader que 4 photos maximum !",
      });
    }
  };

  // Suppression d'une photo
  const handlePhotoDelete = (indexToDelete) => {
    const newPhotos = photos.filter((_, index) => index !== indexToDelete);
    setPhotos(newPhotos);

    // Supprimer un input si nécessaire
    if (newPhotos.length < photoInputs.length && photoInputs.length > 1) {
      setPhotoInputs(photoInputs.slice(0, -1));
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Afficher la confirmation via SweetAlert2
    const result = await Swal.fire({
      title: "Confirmer la publication",
      text: "Voulez-vous vraiment publier cette annonce ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui, publier",
      cancelButtonText: "Annuler",
    });

    if (!result.isConfirmed) return;

    try {
      // Préparer les données de l'annonce
      const annonceData = { ...formData };

      // Envoyer la requête pour créer l'annonce
      const response = await fetch("http://localhost:8000/api/posts", {
        method: "POST",
        credentials: "include", // Envoie les cookies pour l'authentification
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(annonceData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'annonce");
      }

      const data = await response.json();
      const postId = data.data.id; // Récupérer l'ID de l'annonce créée

      // Si aucune photo n'est ajoutée, afficher un succès et rediriger
      if (photos.length === 0) {
        await Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Votre annonce a été publiée avec succès !",
        });
        navigate("/user/annonces");
        return;
      }

      // Envoyer les images une par une
      const uploadPromises = photos.map(async (photo) => {
        const imageData = new FormData();
        imageData.append("image", photo);
        imageData.append("post_id", postId);

        const res = await fetch("http://localhost:8000/api/images", {
          method: "POST",
          credentials: "include", // Envoie les cookies pour l'authentification
          body: imageData,
        });

        if (!res.ok) {
          throw new Error("Erreur lors de l'upload d'une image");
        }
        return await res.json();
      });

      // Attendre que toutes les images soient uploadées
      await Promise.all(uploadPromises);

      await Swal.fire({
        icon: "success",
        title: "Succès",
        text: "Votre annonce et vos images ont été publiées avec succès !",
      });
      navigate("/user/annonces");

    } catch (error) {
      console.error("Erreur lors de la création de l'annonce:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error.message || "Une erreur est survenue lors de la création de l'annonce.",
      });
    }
  };

  // Annulation et redirection
  const handleCancel = () => {
    navigate("/user/annonces");
  };

  // Titre de la description selon la catégorie
  const getDescriptionTitle = () => {
    switch (selectedCategory) {
      case "1":
        return "Décrivez votre villa";
      case "2":
        return "Décrivez votre terrain";
      case "3":
        return "Décrivez votre appartement";
      case "4":
        return "Décrivez votre immeuble";
      case "5":
        return "Décrivez votre bureau ou commerce";
      case "6":
        return "Décrivez votre maison de vacances";
      case "7":
        return "Décrivez votre chambre";
      case "8":
        return "Décrivez votre terrain agricole";
      case "9":
        return "Décrivez votre appartement meublé";
      case "10":
        return "Décrivez votre ferme ou verger";
      case "11":
        return "Décrivez votre voiture";
      default:
        return "Décrivez votre bien";
    }
  };

  // Affichage des champs spécifiques selon la catégorie
  const renderSpecificFields = () => {
    switch (formData.category_id) {
      case "11": // Villas
        return (
          <>
            <div className="form-group">
              <label>Surface</label>
              <input
                type="text"
                name="surface"
                value={formData.surface}
                onChange={handleChange}
                placeholder="m²"
              />
            </div>
            <div className="form-group">
              <label>Nombre de pièces</label>
              <input
                type="text"
                name="nombre_pieces"
                value={formData.nombre_pieces}
                onChange={handleChange}
                placeholder="Nombre de pièces"
              />
            </div>
          </>
        );
      case "10": // Terrains
      case "4": // Terrains agricoles
        return (
          <>
            <div className="form-group">
              <label>Surface</label>
              <input
                type="text"
                name="surface"
                value={formData.surface}
                onChange={handleChange}
                placeholder="m²"
              />
            </div>
            {formData.category_id === "8" && (
              <div className="form-group">
                <label>Type de culture</label>
                <input
                  type="text"
                  name="type_culture"
                  value={formData.type_culture}
                  onChange={handleChange}
                  placeholder="Type de culture (ex. riz, fruits)"
                />
              </div>
            )}
          </>
        );
      case "9": // Appartements
      case "3": // Appartements meublés
        return (
          <>
            <div className="form-group">
              <label>Surface</label>
              <input
                type="text"
                name="surface"
                value={formData.surface}
                onChange={handleChange}
                placeholder="m²"
              />
            </div>
            <div className="form-group">
              <label>Nombre de chambres</label>
              <input
                type="text"
                name="nombre_chambres"
                value={formData.nombre_chambres}
                onChange={handleChange}
                placeholder="Nombre de chambres"
              />
            </div>
            {formData.category_id === "9" && (
              <div className="form-group">
                <label>Équipements inclus</label>
                <input
                  type="text"
                  name="equipements"
                  value={formData.equipements}
                  onChange={handleChange}
                  placeholder="Équipements (ex. meubles, électroménagers)"
                />
              </div>
            )}
          </>
        );
      case "8": // Immeubles
        return (
          <>
            <div className="form-group">
              <label>Surface</label>
              <input
                type="text"
                name="surface"
                value={formData.surface}
                onChange={handleChange}
                placeholder="m²"
              />
            </div>
            <div className="form-group">
              <label>Nombre d’étages</label>
              <input
                type="text"
                name="nombre_etages"
                value={formData.nombre_etages}
                onChange={handleChange}
                placeholder="Nombre d’étages"
              />
            </div>
          </>
        );
      case "7": // Bureaux & Commerces
        return (
          <>
            <div className="form-group">
              <label>Surface</label>
              <input
                type="text"
                name="surface"
                value={formData.surface}
                onChange={handleChange}
                placeholder="m²"
              />
            </div>
            <div className="form-group">
              <label>Type d’activité</label>
              <input
                type="text"
                name="type_activite"
                value={formData.type_activite}
                onChange={handleChange}
                placeholder="Type d’activité (ex. boutique, bureau)"
              />
            </div>
          </>
        );
      case "6": // Maisons de vacances
        return (
          <>
            <div className="form-group">
              <label>Surface</label>
              <input
                type="text"
                name="surface"
                value={formData.surface}
                onChange={handleChange}
                placeholder="m²"
              />
            </div>
            <div className="form-group">
              <label>Nombre de couchages</label>
              <input
                type="text"
                name="nombre_couchages"
                value={formData.nombre_couchages}
                onChange={handleChange}
                placeholder="Nombre de couchages"
              />
            </div>
          </>
        );
      case "5": // Chambres
        return (
          <>
            <div className="form-group">
              <label>Surface</label>
              <input
                type="text"
                name="surface"
                value={formData.surface}
                onChange={handleChange}
                placeholder="m²"
              />
            </div>
            <div className="form-group">
              <label>Commodités</label>
              <input
                type="text"
                name="commodites"
                value={formData.commodites}
                onChange={handleChange}
                placeholder="Commodités (ex. salle de bain privée)"
              />
            </div>
          </>
        );
      case "2": // Fermes & Vergers
        return (
          <>
            <div className="form-group">
              <label>Surface</label>
              <input
                type="text"
                name="surface"
                value={formData.surface}
                onChange={handleChange}
                placeholder="m²"
              />
            </div>
            <div className="form-group">
              <label>Type d’exploitation</label>
              <input
                type="text"
                name="type_exploitation"
                value={formData.type_exploitation}
                onChange={handleChange}
                placeholder="Type d’exploitation (ex. ferme laitière, verger)"
              />
            </div>
          </>
        );
      case "1": // Voitures
        return (
          <>
            <div className="form-group">
              <label>Vitesse maximale</label>
              <input
                type="text"
                name="vitesse"
                value={formData.vitesse}
                onChange={handleChange}
                placeholder="km/h"
              />
            </div>
            <div className="form-group">
              <label>Moteur</label>
              <input
                type="text"
                name="moteur"
                value={formData.moteur}
                onChange={handleChange}
                placeholder="Type de moteur (ex. essence, diesel)"
              />
            </div>
          </>
        );
      default:
        return (
          <div className="form-group">
            <label>Surface</label>
            <input
              type="text"
              name="surface"
              value={formData.surface}
              onChange={handleChange}
              placeholder="m²"
            />
          </div>
        );
    }
  };

  return (
    <div className="pub-page">
      <h1>Rédigez votre annonce</h1>

      <div className="pub-form-container">
        {/* Section Ajout de photos */}
        <div className="pub-section">
          <h2>Ajoutez des photos*</h2>
          <p>
            Ajoutez plus de photos pour augmenter vos chances d’être contacté
            (max 4)
          </p>
          <div className="photo-upload">
            {photos.length > 0 &&
              photos.map((photo, index) => (
                <div key={index} className="photo-preview">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Preview ${index}`}
                  />
                  <button
                    type="button"
                    className="delete-photo-btn"
                    onClick={() => handlePhotoDelete(index)}
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            {photoInputs.map((inputIndex) => (
              <label
                key={inputIndex}
                htmlFor={`photo-input-${inputIndex}`}
                className={`photo-placeholder ${photos.length >= 4 ? "disabled" : ""
                  }`}
              >
                <i className="fas fa-camera"></i>
                <span>
                  Photo {inputIndex === 1 ? "principale" : inputIndex}
                </span>
              </label>
            ))}
            {photoInputs.map((inputIndex) => (
              <input
                key={inputIndex}
                id={`photo-input-${inputIndex}`}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handlePhotoUpload(e, inputIndex - 1)}
                style={{ display: "none" }}
                disabled={photos.length >= 4}
              />
            ))}
          </div>
          <div className="photo-notes">
            <p>
              <i className="fas fa-info-circle"></i> Ajoutez jusqu’à 4 photos pour une meilleure visibilité. Les images claires et bien éclairées attirent plus d’acheteurs !
            </p>
            <p>
              <i className="fas fa-info-circle"></i> Prenez des photos sous différents angles pour montrer tous les détails.
            </p>
            <p>
              <i className="fas fa-info-circle"></i> Évitez les images floues ou mal éclairées pour un meilleur impact.
            </p>
            <p>
              <i className="fas fa-info-circle"></i> Utilisez un fond neutre pour mettre en valeur votre article.
            </p>
            <p>
              <i className="fas fa-info-circle"></i> Incluez une photo de l’intérieur si c’est un bien immobilier.
            </p>
            <p>
              <i className="fas fa-info-circle"></i> Ajoutez des photos de l’extérieur pour les terrains ou maisons.
            </p>
            <p>
              <i className="fas fa-info-circle"></i> Assurez-vous que les objets sont bien rangés sur les photos.
            </p>
            <p>
              <i className="fas fa-info-circle"></i> Évitez les filtres ou modifications excessives sur les images.
            </p>
            <p>
              <i className="fas fa-info-circle"></i> Prenez des photos en plein jour pour une lumière naturelle.
            </p>
            <p>
              <i className="fas fa-info-circle"></i> Montrez l’état réel de l’article sans retouche.
            </p>
            <p>
              <i className="fas fa-info-circle"></i> Assurez-vous que les objets sont bien rangés sur les photos.
            </p>
            <p>
              <i className="fas fa-info-circle"></i> Évitez les filtres ou modifications excessives sur les images.
            </p>
            <p>
              <i className="fas fa-info-circle"></i> Prenez des photos en plein jour pour une lumière naturelle.
            </p>
            <p>
              <i className="fas fa-info-circle"></i> Montrez l’état réel de l’article sans retouche.
            </p>
          </div>
        </div>

        {/* Section Conseils */}
        <div className="pub-tips">
          <h3>25 règles pour publier votre annonce :</h3>
          <ul>
            <li>N’écrivez pas le prix dans le titre</li>
            <li>
              N’indiquez pas vos coordonnées (téléphone, e-mail...) dans la
              description
            </li>
            <li>Ne publiez pas la même annonce plusieurs fois</li>
            <li>Ne vendez pas d’objets ou de services illégaux</li>
            <li>Utilisez des descriptions détaillées et précises</li>
            <li>Assurez-vous que vos photos respectent les droits d’auteur</li>
            <li>Ne publiez pas d’annonces trompeuses ou exagérées</li>
            <li>Indiquez une ville ou une localisation exacte</li>
            <li>Évitez les abréviations ou le jargon incompréhensible</li>
            <li>Mettez à jour votre annonce si elle n’est plus pertinente</li>
            <li>Ne partagez pas de liens externes dans la description</li>
            <li>Utilisez des titres courts et descriptifs</li>
            <li>Évitez les majuscules excessives dans le titre</li>
            <li>Incluez des mots-clés pertinents dans la description</li>
            <li>Ne proposez pas de produits contrefaits</li>
            <li>Vérifiez l’orthographe avant de publier</li>
            <li>Respectez les lois locales en vigueur</li>
            <li>Ne demandez pas de paiement anticipé sans garantie</li>
            <li>Indiquez si l’article est neuf ou d’occasion</li>
            <li>Ne publiez pas d’annonces commerciales non autorisées</li>
            <li>Utilisez des photos de bonne qualité (minimum 800x600px)</li>
            <li>Évitez les annonces avec des informations incomplètes</li>
            <li>Ne proposez pas d’échanges sans accord préalable</li>
            <li>Signalez toute erreur dans votre annonce après publication</li>
            <li>Respectez les limites de caractères pour chaque champ</li>
          </ul>
        </div>

        {/* Section Description du bien */}
        <div className="pub-section">
          <h2>{getDescriptionTitle()}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Type d’offre*</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="Vente">Vente</option>
                <option value="Location">Location</option>
              </select>
            </div>

            <div className="form-group">
              <label>Catégorie*</label>
              <div className="type-options">
                {[
                  { id: "1", name: "Voitures" },
                  { id: "2", name: "Fermes & Vergers" },
                  { id: "3", name: "Appartements meublés" },
                  { id: "4", name: "Terrains agricoles" },
                  { id: "5", name: "Chambres" },
                  { id: "6", name: "Maisons de vacances" },
                  { id: "7", name: "Bureaux & Commerces" },
                  { id: "8", name: "Immeubles" },
                  { id: "9", name: "Appartements" },
                  { id: "10", name: "Terrains" },
                  { id: "11", name: "Villas" },
                ].map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={`type-btn ${selectedCategory === category.id ? "active" : ""
                      }`}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Champs spécifiques selon la catégorie */}
            {renderSpecificFields()}

            <div className="form-group">
              <label>Ville*</label>
              <select name="city" value={formData.city} onChange={handleChange}>
                <option value="">Choisissez une ville</option>
                <option value="Antananarivo">Antananarivo</option>
                <option value="Tamatave">Tamatave</option>
                <option value="Fianarantsoa">Fianarantsoa</option>
                <option value="Antsirabe">Antsirabe</option>
                <option value="Mahajanga">Mahajanga</option>
                <option value="Toamasina">Toamasina</option>
                <option value="Toliara">Toliara</option>
              </select>
              <small>
                Choisissez une ville courte et précise. Ne mentionnez pas le
                prix !
              </small>
            </div>

            <div className="form-group">
              <label>Saisissez le titre*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Indiquez le prix exact de l'article. Une annonce sans prix aura moins de vue."
              />
            </div>

            <div className="form-group">
              <label>Prix</label>
              <input
                type="text"
                name="title_price"
                value={formData.title_price}
                onChange={handleChange}
                placeholder="MGA"
              />
              <small>0/650</small>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Donnez une description détaillée de votre article. Indiquez pas vos coordonnées (e-mail, téléphone...) dans la description"
              />
            </div>

            {/* Section Contact vendeur */}
            <div className="pub-section">
              <h2>Contact vendeur</h2>
              <div className="form-group">
                <label>Numéro de téléphone vendeur*</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+261 Numéro de téléphone vendeur*"
                />
              </div>
              <div className="form-group">
                <label>Numéro WhatsApp vendeur</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="Numéro WhatsApp vendeur"
                />
              </div>
            </div>

            {/* Section Mode de paiement */}
            <div className="pub-section">
              <h2>Mode de paiement</h2>
              <div className="form-group">
                <label>Choisissez un mode de paiement :</label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                >
                  <option value="gratuit">Gratuit</option>
                  <option value="paypal">PayPal</option>
                  <option value="bitcoin">Bitcoin</option>
                  <option value="mvola">Mvola</option>
                  <option value="orangemoney">Orange Money</option>
                  <option value="airtel">Airtel Money</option>
                  <option value="wave">Wave</option>
                </select>
                <small>
                  Le mode "Gratuit" permet une publication standard. Les autres
                  modes déverrouillent des options premium (mieux mis en avant).
                </small>
                <div className="payment-logos">
                  <a
                    href="https://www.paypal.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="payment-logo paypal"
                  >
                    <i className="fab fa-paypal"></i>
                  </a>
                  <a
                    href="https://bitcoin.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="payment-logo bitcoin"
                  >
                    <i className="fab fa-bitcoin"></i>
                  </a>
                  <a
                    href="https://mvola.mg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="payment-logo mvola"
                  >
                    <i className="fas fa-mobile"></i>
                  </a>
                  <a
                    href="https://www.orange.mg/orange-money"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="payment-logo orangemoney"
                  >
                    <i className="fas fa-money-bill-wave"></i>
                  </a>
                  <a
                    href="https://www.airtel.africa/money"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="payment-logo airtel"
                  >
                    <i className="fas fa-mobile"></i>
                  </a>
                  <a
                    href="https://www.wave.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="payment-logo wave"
                  >
                    <i className="fas fa-wave-square"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Boutons Annuler et Publier */}
            <div className="form-actions">
              <button type="submit" className="publish-btn">
                Publier gratuitement
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Pub;