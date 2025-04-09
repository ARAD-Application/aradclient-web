import { AutoArchiveFrequency, OPERATION_URLS } from "@/constants";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import md5 from "md5";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { deleteCookie } from "@/lib/utils";

function Profile() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [isVerified, setIsVerified] = useState(localStorage.getItem("isVerified") === "true");
    const [verificationCode, setVerificationCode] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [autoArchiveFrequency, setAutoArchiveFrequency] = useState(AutoArchiveFrequency.NEVER as keyof typeof AutoArchiveFrequency);
    const [isChanged, setIsChanged] = useState(false);
    const [isVerificationLoading, setIsVerificationLoading] = useState<boolean>(false);
    // const [isSaveChangesLoading, setIsSaveChangesLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                // const response = await fetch(OPERATION_URLS.ACCOUNT_DETAILS, {
                //     method: "POST",
                //     headers: { "Content-Type": "application/json" },
                //     credentials: 'include',
                //     body: JSON.stringify({ token })
                // });
                const response = await fetch(OPERATION_URLS.ACCOUNT_DETAILS, {
                    // method: "GET",
                    // headers: { "Content-Type": "application/json" },
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setFullName(data.fullName);
                    setEmail(data.email);
                    setAutoArchiveFrequency(data.autoArchiveFrequency as keyof typeof AutoArchiveFrequency);
                }
            } catch (error) {
                alert("Failed to fetch account details.");
            }
        };
        fetchAccountDetails();
    }, [token]);

    const gravatarUrl = `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}?s=100`;

    const handleVerification = async () => {
        setIsVerificationLoading(true);
        try {
            const response = await fetch(OPERATION_URLS.VERIFY_ACCOUNT_WITH_CODE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                // body: JSON.stringify({ token, code: verificationCode })
                body: JSON.stringify({ code: verificationCode })
            });
            if (response.ok) {
                localStorage.setItem("isVerified", "true");
                setIsVerified(true);
            } else {
                alert("Verification failed. Please check the code and try again.");
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
        }
        setIsVerificationLoading(false);
    };

    const handleSaveChanges = async () => {
        // setIsSaveChangesLoading(true);
        try {
            const response = await fetch(OPERATION_URLS.CHANGE_USER_DETAILS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                // body: JSON.stringify({ newEmail: email, newFullName: fullName, newAutoArchiveFrequency: autoArchiveFrequency, token })
                body: JSON.stringify({ newEmail: email, newFullName: fullName, newAutoArchiveFrequency: autoArchiveFrequency })
            });
            if (response.ok) {
                alert("Profile updated successfully.");
                setIsChanged(false);
            } else {
                alert("Failed to update profile.");
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
        }
        // setIsSaveChangesLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("isVerified");
        localStorage.removeItem("userRole");
        deleteCookie('jwtPayload');
        navigate("/");
    };

    return (
        <ProtectedRoute>
            <div className="p-4 max-w-md mx-auto">
                {!isVerified ? (
                    <div className="text-center">
                        <p className="mb-4">Check your email for a verification code and enter it below:</p>
                        <Input type="text" placeholder="Verification Code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                        <Button onClick={handleVerification} className="mt-2" disabled={isVerificationLoading}>Verify</Button>
                        <Button onClick={handleLogout} className="mt-4 w-full bg-red-500 hover:bg-red-600">Logout</Button>
                    </div>
                ) : (
                    <div>
                        <img src={gravatarUrl} alt="Profile" className="rounded-full mx-auto mb-4" />
                        <label className="block font-medium">Name</label>
                        <Input type="text" value={fullName} onChange={(e) => { setFullName(e.target.value); setIsChanged(true); }} placeholder="Full Name" />
                        <label className="block font-medium mt-2">Email</label>
                        <Input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setIsChanged(true); }} placeholder="Email" className="mt-2" />
                        {/* <Select value={autoArchiveFrequency} onValueChange={(value) => { setAutoArchiveFrequency(value as keyof typeof AutoArchiveFrequency); setIsChanged(true); }} className="mt-2"> */}
                        <label className="block font-medium mt-2">Auto Archive Frequency</label>
                        <Select value={autoArchiveFrequency} onValueChange={(value) => { setAutoArchiveFrequency(value as keyof typeof AutoArchiveFrequency); setIsChanged(true); }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Auto Archive Frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(AutoArchiveFrequency).map((freq) => (
                                    <SelectItem key={freq} value={freq}>{freq.replace(/_/g, " ")}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleSaveChanges} className="mt-4 w-full" disabled={!isChanged}>Save Changes</Button>
                        <Button onClick={handleLogout} className="mt-4 w-full bg-red-500 hover:bg-red-600">Logout</Button>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}

export default Profile;