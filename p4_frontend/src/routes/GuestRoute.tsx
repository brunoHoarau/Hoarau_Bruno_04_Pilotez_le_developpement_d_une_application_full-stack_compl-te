import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";

const GuestRoute = () => {
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
    }, [checkAuth]);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (authenticated) {
        return <Navigate to="/myspace" replace />;
    }

    return <Outlet />;
};

export default GuestRoute;