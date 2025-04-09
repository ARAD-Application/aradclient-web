
import { Input } from "@/components/ui/input";
import { OPERATION_URLS } from "@/constants";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(OPERATION_URLS.LOGIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("isVerified", data.isVerified);
                localStorage.setItem("userRole", data.role);
                navigate("/learning");
            } else {
                alert("Login failed. Please check your credentials.");
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
        }
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-6">Log In</h1>
            <div className="space-y-4 w-72">
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button onClick={handleLogin} className="w-full" disabled={isLoading}>Log In</Button>
                <p className="text-sm text-gray-600 text-center">
                    Don't have an account? <Link to="/signup" className="text-blue-500">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;