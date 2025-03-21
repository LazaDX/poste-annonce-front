// src/components/ThemeContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Récupère le thème sauvegardé dans localStorage, sinon utilise "light" par défaut
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    // Applique le thème à la racine du document
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme); // Sauvegarde le thème dans localStorage
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};