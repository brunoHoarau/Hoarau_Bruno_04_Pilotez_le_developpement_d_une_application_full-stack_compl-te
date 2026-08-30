import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = () => {
    const { checkAuth } = useAuth();

    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const check = async () => {
            const result = await checkAuth();

            setAuthenticated(result);
            setLoading(false);
        };

        check();
    }, []);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;