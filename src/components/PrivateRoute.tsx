import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { JSX } from "react";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
    const { user, loading } = useUser();
    const location = useLocation();

    if (loading) return <div>Chargement...</div>; // ⏳ attend la vérification

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}