import { Button } from "@/components/ui/button";
import { OPERATION_URLS } from "@/constants";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function Signup() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();


    const handleSignup = async () => {
        setIsLoading(true);
        try {
            if (!fullName || !email || !password || !role) {
                alert("Please fill in all fields.");
                return;
            }
            const response = await fetch(OPERATION_URLS.SIGNUP, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, email, role, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("isVerified", 'false');
                localStorage.setItem("userRole", role);
                navigate("/profile");
            } else {
                alert(data['message']);
                // alert("Signup failed. Please try again.");
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
        }
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
            <div className="space-y-4 w-72">
                <Input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Select onValueChange={setRole}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PHYSICIAN">Physician</SelectItem>
                        <SelectItem value="RESIDENT">Resident</SelectItem>
                    </SelectContent>
                </Select>

                <Button onClick={handleSignup} className="w-full" disabled={isLoading}>Sign Up</Button>
                <p className="text-sm text-gray-600 text-center">
                    Already have an account? <Link to="/login" className="text-blue-500">Log In</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;