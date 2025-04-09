
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import PersonSearch from "@/components/ui/PersonSearch";
import SearchProcedureByCode from "@/components/ui/SearchProcedureByCode";
import SearchProcedureByDescription from "@/components/ui/SearchProcedureByDescription";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { OPERATION_URLS } from "@/constants";
import { ProcedureSearchResult, QualityRating, UserSearchResult } from "@/lib/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FeedbackForm() {

    const navigate = useNavigate();

    const [selectedPerson, setSelectedPerson] = useState<UserSearchResult | null>(null);
    const [selectedProcedure, setSelectedProcedure] = useState<ProcedureSearchResult | null>(null);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [description, setDescription] = useState("");
    const [tissueHandling, setTissueHandling] = useState("");
    const [knowledgeOfAnatomy, setKnowledgeOfAnatomy] = useState("");
    const [knowledgeOfSurgerySteps, setKnowledgeOfSurgerySteps] = useState("");
    const [understandingOfPathophysiology, setUnderstandingOfPathophysiology] = useState("");
    const [communication, setCommunication] = useState("");
    const [freeFormFeedback, setFreeFormFeedback] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (selectedProcedure) {
            setDescription(selectedProcedure?.description);
        }
    }, [selectedProcedure]);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (!selectedPerson || !selectedProcedure || !date || description === '' ||
                    tissueHandling === '' || knowledgeOfAnatomy === '' || knowledgeOfSurgerySteps === '' ||
                    understandingOfPathophysiology === '' || communication === ''
            ) {
                alert("Please fill in all fields.");
                setIsLoading(false);
                return;
            }
            const response = await fetch(OPERATION_URLS.CREATE_FEEDBACK, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({
                    // "token": localStorage.getItem('token'),
                    "receivingUser": selectedPerson?.id,
                    "procedureDateTime": date,
                    "cptCode": selectedProcedure?.code,
                    "briefOperationDescription": description,
                    "tissueHandling": tissueHandling,
                    "knowledgeOfAnatomy": knowledgeOfAnatomy,
                    "knowledgeOfSurgerySteps": knowledgeOfSurgerySteps,
                    "knowledgeOfPathophysiology": understandingOfPathophysiology,
                    "communication": communication,
                    "freeFormFeedback": freeFormFeedback
                })
            });

            if (response.ok) {
                navigate("/feedback");
            } else {
                alert("Feedback submission failed. Please try again.");
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
        }
        setIsLoading(false);
    };

    return (
        <div className="p-6 max-w-lg mx-auto space-y-4">
            <div>
                <label className="block mb-2">Find a Resident</label>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">{selectedPerson?.fullName || "Select a Resident"}</Button>
                    </DialogTrigger>
                    <DialogContent>
                        {/* This DialogTitle is for accessibility */}
                        <DialogTitle>Search for a resident</DialogTitle>
                        <PersonSearch onSelect={setSelectedPerson} />
                    </DialogContent>
                </Dialog>
            </div>

            <div>
                <label className="block mb-2">Select Date of Procedure</label>
                <Calendar mode="single" selected={date} onSelect={setDate} />
            </div>

            <div>
                <label className="block mb-2">Find Procedure</label>
                {selectedProcedure && <p>Selected procedure code: {selectedProcedure.code}</p>}
                {!selectedProcedure && <p>No procedure selected</p>}
                <Dialog>
                    <DialogTrigger asChild>
                        {/* <Button variant="outline">{selectedProcedure?.code || "Find by Code"}</Button> */}
                        <Button variant="outline">{"Find by Code"}</Button>
                    </DialogTrigger>
                    <DialogContent className="overflow-y-scroll max-h-screen">
                        {/* This DialogTitle is for accessibility */}
                        <DialogTitle>Search for a procedure</DialogTitle>
                        <SearchProcedureByCode onSelect={setSelectedProcedure} />
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        {/* <Button variant="outline">{selectedProcedure?.code || "Advanced Search"}</Button> */}
                        <Button variant="outline">{"Advanced Search"}</Button>
                    </DialogTrigger>
                    <DialogContent className="overflow-y-scroll max-h-screen">
                        {/* This DialogTitle is for accessibility */}
                        <DialogTitle>Search for a procedure</DialogTitle>
                        <SearchProcedureByDescription onSelect={setSelectedProcedure} />
                    </DialogContent>
                </Dialog>
            </div>

            <div>
                <label className="block mb-2">Brief Description</label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div>
                <label className="block mb-2">Tissue Handling</label>
                <Select value={tissueHandling} onValueChange={setTissueHandling}>
                    <SelectTrigger>{tissueHandling !== '' ? tissueHandling : "Select an option"}</SelectTrigger>
                    <SelectContent>
                        {Object.values(QualityRating).map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <label className="block mb-2">Knowledge of Anatomy</label>
                <Select value={knowledgeOfAnatomy} onValueChange={setKnowledgeOfAnatomy}>
                    <SelectTrigger>{knowledgeOfAnatomy !== '' ? knowledgeOfAnatomy : 'Select an option'}</SelectTrigger>
                    <SelectContent>
                        {Object.values(QualityRating).map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <label className="block mb-2">Knowledge of Surgery Steps</label>
                <Select value={knowledgeOfSurgerySteps} onValueChange={setKnowledgeOfSurgerySteps}>
                    <SelectTrigger>{knowledgeOfSurgerySteps !== '' ? knowledgeOfSurgerySteps : 'Select an option'}</SelectTrigger>
                    <SelectContent>
                        {Object.values(QualityRating).map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <label className="block mb-2">Understanding of Pathophysiology</label>
                <Select value={understandingOfPathophysiology} onValueChange={setUnderstandingOfPathophysiology}>
                    <SelectTrigger>{understandingOfPathophysiology !== '' ? understandingOfPathophysiology : 'Select an option'}</SelectTrigger>
                    <SelectContent>
                        {Object.values(QualityRating).map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <label className="block mb-2">Communication</label>
                <Select value={communication} onValueChange={setCommunication}>
                    <SelectTrigger>{communication !== '' ? communication : 'Select an option'}</SelectTrigger>
                    <SelectContent>
                        {Object.values(QualityRating).map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div>
                    <label className="block mb-2">Other feedback</label>
                    <Input value={freeFormFeedback} onChange={(e) => setFreeFormFeedback(e.target.value)} />
                </div>
            </div>

            <Button className="w-full" onClick={handleSubmit} disabled={isLoading}>Submit</Button>
        </div>
    );
}

export { FeedbackForm };
