import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate, Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import AuthNavbar from "../AuthNavbar";
import Annonces from "../Annonces";
import Informations from "../informations/informations";
import Pub from "../publication/pub";
import Chat from "../chat/chat";
import Login from "../auth/login";
import Inscription from "../auth/inscription";
import Footer from "../footer/footer";
import Bannier from "../bannier/bannier";


function UserLayout() {
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (!isAuthenticated) {

        return <Navigate to="/" />;
    }
    return (
        <>
            <div className="app-container">
                <Navbar />
                <Outlet />
                <Footer />
            </div>
        </>
    );
}

export default UserLayout;