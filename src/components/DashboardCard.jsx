// src/components/DashboardCard.jsx
import React from "react";
import "./DashboardCard.css";

const DashboardCard = ({ title, value, icon, color }) => {
  return (
    <div className="dashboard-card" style={{ background: color }}>
      <div className="card-icon">
        <i className={icon}></i>
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;