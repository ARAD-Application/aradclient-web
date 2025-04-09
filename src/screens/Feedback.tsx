import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { OPERATION_URLS } from "@/constants";
import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FeedbackItem, Role } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

function Feedback() {
    // const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<FeedbackItem[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setFilteredItems(feedbackList);
    }, [feedbackList])

    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
        const filtered = feedbackList.filter(item =>
            item.feedbackGiverName.toLowerCase().includes(text.toLowerCase()) ||
            item.feedbackReceiverName.toLowerCase().includes(text.toLowerCase()) ||
            item.feedback.cptCode.toLowerCase().includes(text.toLowerCase()) ||
            item.feedback.briefOperationDescription.toLowerCase().includes(text.toLowerCase()) ||
            item.feedback.freeFormFeedback.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredItems(filtered);
    }

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await fetch(OPERATION_URLS.GET_ALL_FEEDBACK, {
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setFeedbackList(data);
                }
            } catch (error) {
                alert("Failed to fetch feedback.");
            }
        };
        fetchFeedback();
    }, []);

    const markAsRead = async (feedback: FeedbackItem) => {
        if (userRole !== Role.PHYSICIAN) {
            try {
                await fetch(OPERATION_URLS.SET_FEEDBACK_AS_READ, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ feedbackObjectMongoDBID: feedback.mongoDBID })
                });
            } catch (error) {
                console.error("Failed to mark feedback as read");
            }
        }
    };

    return (
        <ProtectedRoute>
            <div className="p-4 max-w-md mx-auto">
                <h1 className="text-xl font-bold mb-4">Feedback</h1>
                <Input placeholder="Filter items..." value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} />
                <br />
                <div>
                    {/* {feedbackList.map((item) => ( */}
                    {filteredItems.map((item) => (
                        <Dialog key={item.mongoDBID}>
                            <DialogTrigger>
                                <div className={`p-2 border rounded mb-2 cursor-pointer ${!item.feedback.isRead ? "font-bold" : ""}`} onClick={() => { setSelectedFeedback(item); markAsRead(item); }}>
                                    <h2 className="text-lg font-semibold">{item.feedback.cptCode}</h2>
                                    <p className="text-sm">From: {item.feedbackGiverName}, To: {item.feedbackReceiverName}</p>
                                    <p className="text-sm">Date: {new Date(item.feedback.procedureDateTime).toLocaleString()}</p>
                                    <p className="text-sm text-gray-600">{item.feedback.freeFormFeedback.substring(0, 50)}...</p>
                                </div>
                            </DialogTrigger>
                            {selectedFeedback && (
                                <DialogContent>
                                    <DialogTitle>{selectedFeedback.feedback.cptCode}</DialogTitle>
                                    <DialogDescription>
                                        <strong>From:</strong> {selectedFeedback.feedbackGiverName}
                                        <br />
                                        <strong>To:</strong> {selectedFeedback.feedbackReceiverName}
                                        <br />
                                        <strong>Date:</strong> {new Date(selectedFeedback.feedback.procedureDateTime).toLocaleString()}
                                        <br />
                                        <strong>CPT Code:</strong> {selectedFeedback.feedback.cptCode}
                                        <br />
                                        <strong>Tissue Handling:</strong> {selectedFeedback.feedback.tissueHandling}
                                        <br />
                                        <strong>Knowledge of Anatomy:</strong> {selectedFeedback.feedback.knowledgeOfAnatomy}
                                        <br />
                                        <strong>Knowledge of Surgery Steps:</strong> {selectedFeedback.feedback.knowledgeOfSurgerySteps}
                                        <br />
                                        <strong>Understanding of Pathophysiology:</strong> {selectedFeedback.feedback.knowledgeOfPathophysiology}
                                        <br />
                                        <strong>Communication:</strong> {selectedFeedback.feedback.communication}
                                        <br />
                                        <strong>Freeform Feedback:</strong> {selectedFeedback.feedback.freeFormFeedback}
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
                        onClick={() => navigate('/create_feedback')}>
                        +
                    </Button>
                )}
            </div>
        </ProtectedRoute>
    );
}

export default Feedback;