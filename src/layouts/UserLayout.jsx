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

        return <Navigate to="/login" />;
    }
    return (
        <>
            <div className="app-container">
                <Navbar />
                {/* <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <Bannier />
                                <Annonces />
                            </>
                        }
                    />
                    <Route path="/" element={<Navigate to="annonces" />} />
                    <Route path="/annonces" element={<Annonces />} />
                    <Route path="/informations/:id" element={<Informations />} />
                    <Route path="/publication" element={<Pub />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/inscription" element={<Inscription />} />
                </Routes> */}

                <Outlet />
                <Footer />
            </div>
        </>
    );
}

export default UserLayout;