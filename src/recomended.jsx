import React, { useState } from "react";
import "./recomended.css"; // Importation du CSS

// Déclaration du composant fonctionnel
const Recomended = () => {
  return (
    <>
      <div>
        <h2 className="recommended-title">Recommandé</h2>
        <div className="recommended-flex">
          <button className="btns">All products</button>
          <button className="btns">voaoao</button>
          <button className="btns">voaoao</button>
          <button className="btns">voaoao</button>
          <button className="btns">voaoao</button>
          <button className="btns">voaoao</button>
        </div>
      </div>
    </>
  );
};

export default Recomended;
