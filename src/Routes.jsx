import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/login";
import Inscription from "./auth/inscription";
import PrivateRoute from "./PrivateRoute";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import Annonces from "./Annonces";
import Informations from "./informations/informations";
import Pub from "./publication/pub";
import Chat from "./chat/chat";
import Bannier from "./bannier/bannier";
import Profil from "./profil/profil";
import Favoris from "./favoris/favoris";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Login />} />
            <Route path="/inscription" element={<Inscription />} />

            {/* Routes utilisateur protégées */}
            <Route
                path="/user/*"
                element={
                    <PrivateRoute>
                        <UserLayout />
                    </PrivateRoute>
                }
            >
                <Route index element={<Navigate to="annonces" />} />
                <Route
                    path="annonces"
                    element={
                        <>
                            <Bannier />
                            <Annonces />
                        </>
                    }
                />
                <Route path="profil" element={<Profil />} />
                <Route path="favoris" element={<Favoris />} />
                <Route path="informations/:id" element={<Informations />} />
                <Route path="publication" element={<Pub />} />
                <Route path="chat" element={<Chat />} />
            </Route>

            {/* Routes admin protégées */}
            <Route
                path="/admin/*"
                element={
                    <PrivateRoute>
                        <AdminLayout />
                    </PrivateRoute>
                }
            >
                {/* Ajouter les sous-routes admin ici si nécessaire */}
                <Route index element={<Navigate to="dashboard" />} />
                {/* <Route
                    path="/"
                    element={
                        <ErrorBoundary>
                            <Dashboard />
                        </ErrorBoundary>
                    }
                />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<UserDetails />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/transactions/:id" element={<TransactionDetails />} />
                <Route path="/annonces" element={<Annonces />} />
                <Route path="/annonces/:id" element={<AnnonceDetails />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile/view" element={<ProfileView />} />
                <Route path="/profile/edit" element={<ProfileEdit />} />
                <Route path="/add-admin" element={<AddAdmin />} /> */}
            </Route>
        </Routes>
    );
};

export default AppRoutes;