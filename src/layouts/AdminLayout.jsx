import { BrowserRouter as Router, Route, Routes, useLocation, Navigate, Outlet } from "react-router-dom";
import Dashboard from "../pages/Dashboard";


function AdminLayout() {
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (!isAuthenticated) {
        return <Navigate to="" />;
    }

    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </>
    );
}

export default AdminLayout;