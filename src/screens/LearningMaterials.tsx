
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { OPERATION_URLS } from "@/constants";
import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AssignedLearningMaterial } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

function LearningMaterials() {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const [assignedLearningMaterialsList, setAssignedLearningMaterialsList] = useState<AssignedLearningMaterial[]>([]);
    const [selectedAssignedLearningMaterial, setSelectedAssignedLearningMaterial] = useState<AssignedLearningMaterial | null>(null);
    const [filteredItems, setFilteredItems] = useState<AssignedLearningMaterial[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        setFilteredItems(assignedLearningMaterialsList);
    }, [assignedLearningMaterialsList])

    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
        const filtered = assignedLearningMaterialsList.filter(item =>
            item.learningMaterialAssignerName.toLowerCase().includes(text.toLowerCase()) ||
            item.learningMaterialAssigneeName.toLowerCase().includes(text.toLowerCase()) ||
            item.assignedLearningMaterial.cptCode.toLowerCase().includes(text.toLowerCase()) ||
            item.assignedLearningMaterial.learningMaterials.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredItems(filtered);
    }

    useEffect(() => {
        const fetchAssignedLearningMaterials = async () => {
            try {
                const response = await fetch(OPERATION_URLS.GET_ALL_ASSIGNED_LEARNING_MATERIALS, {
                    // method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include'
                    // body: JSON.stringify({ token })
                });
                if (response.ok) {
                    const data = await response.json();
                    setAssignedLearningMaterialsList(data);
                }
            } catch (error) {
                alert("Failed to fetch assigned learning materials.");
            }
        };
        fetchAssignedLearningMaterials();
    }, [token]);

    const markAsRead = async (assignedLearningMaterial: AssignedLearningMaterial) => {
        try {
            await fetch(OPERATION_URLS.SET_LEARNING_MATERIAL_AS_READ, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                // body: JSON.stringify({ token, objectMongoDBID: assignedLearningMaterial.mongoDBID })
                body: JSON.stringify({ objectMongoDBID: assignedLearningMaterial.mongoDBID })
            });
        } catch (error) {
            console.error("Failed to mark learning material as read");
        }
    };

    return (
        <ProtectedRoute>
            <div className="p-4 max-w-md mx-auto">
                <h1 className="text-xl font-bold mb-4">Learning Materials</h1>
                <Input placeholder="Filter items..." value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} />
                <br />
                <div>
                    {/* {assignedLearningMaterialsList.map((item) => ( */}
                    {filteredItems.map((item) => (
                        <Dialog key={item.mongoDBID}>
                            <DialogTrigger>
                                <div className={`p-2 border rounded mb-2 cursor-pointer ${!item.assignedLearningMaterial.isRead ? "font-bold" : ""}`} onClick={() => { setSelectedAssignedLearningMaterial(item); markAsRead(item); }}>
                                    <h2 className="text-lg font-semibold">{item.assignedLearningMaterial.cptCode}</h2>
                                    <p className="text-sm">From: {item.learningMaterialAssignerName}, To: {item.learningMaterialAssigneeName}</p>
                                    <p className="text-sm">Date: {new Date(item.assignedLearningMaterial.procedureDateTime).toLocaleString()}</p>
                                    <p className="text-sm text-gray-600">{item.assignedLearningMaterial.learningMaterials.substring(0, 50)}...</p>
                                </div>
                            </DialogTrigger>
                            {selectedAssignedLearningMaterial && (
                                <DialogContent>
                                    <DialogTitle>{selectedAssignedLearningMaterial.assignedLearningMaterial.cptCode}</DialogTitle>
                                    <DialogDescription>
                                        <strong>From:</strong> {selectedAssignedLearningMaterial.learningMaterialAssignerName}
                                        <br />
                                        <strong>To:</strong> {selectedAssignedLearningMaterial.learningMaterialAssigneeName}
                                        <br />
                                        <strong>Date:</strong> {new Date(selectedAssignedLearningMaterial.assignedLearningMaterial.procedureDateTime).toLocaleString()}
                                        <br />
                                        <strong>CPT Code:</strong> {selectedAssignedLearningMaterial.assignedLearningMaterial.cptCode}
                                        <br />
                                        <strong>Learning Materials:</strong> {selectedAssignedLearningMaterial.assignedLearningMaterial.learningMaterials}
                                        <br />
                                    </DialogDescription>
                                </DialogContent>
                            )}
                        </Dialog>
                    ))}
                </div>
                {userRole === "PHYSICIAN" && (
                    <Button
                        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl"
                        onClick={() => navigate('/assign_learningmaterial')}>
                        +
                    </Button>
                )}
            </div>
        </ProtectedRoute>
    );
}

export default LearningMaterials;