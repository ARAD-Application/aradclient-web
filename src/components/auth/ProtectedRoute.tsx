import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    // const token = localStorage.getItem("token");
    const isVerified = localStorage.getItem('isVerified');

    useEffect(() => {
        if (!isVerified && location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/signup") {
            navigate("/");
        } else if (isVerified === "false" && location.pathname !== '/profile') {
            navigate('/profile');
        }
    }, [isVerified, location, navigate]);

    return children;
}

export default ProtectedRoute;