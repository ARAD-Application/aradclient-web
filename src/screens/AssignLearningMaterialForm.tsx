
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PersonSearch from "@/components/ui/PersonSearch";
import SearchProcedureByCode from "@/components/ui/SearchProcedureByCode";
import SearchProcedureByDescription from "@/components/ui/SearchProcedureByDescription";
import { Textarea } from "@/components/ui/textarea";
import { OPERATION_URLS } from "@/constants";
import { ProcedureSearchResult, UserSearchResult } from "@/lib/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AssignLearningMaterialForm() {

    const navigate = useNavigate();

    const [selectedPerson, setSelectedPerson] = useState<UserSearchResult | null>(null);
    const [selectedProcedure, setSelectedProcedure] = useState<ProcedureSearchResult | null>(null);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [learningMaterials, setLearningMaterials] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (selectedProcedure) {
            setLearningMaterials(selectedProcedure?.learningMaterials);
            console.log(selectedProcedure);
        }
    }, [selectedProcedure]);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (!selectedPerson || !date || learningMaterials === '') {
                alert("Please fill in all fields.");
                setIsLoading(false);
                return;
            }
            const response = await fetch(OPERATION_URLS.ASSIGN_LEARNING_MATERIALS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "token": localStorage.getItem('token'),
                    "receivingUser": selectedPerson.id,
                    "procedureDateTime": date,
                    "cptCode": selectedProcedure?.code,
                    "learningMaterials": learningMaterials
                })
            });

            if (response.ok) {
                navigate("/learning");
            } else {
                alert("Learning materials submission failed. Please try again.");
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
                <label className="block mb-2">Learning Materials</label>
                <Textarea value={learningMaterials} onChange={(e) => setLearningMaterials(e.target.value)} />
            </div>

            <Button className="w-full" onClick={handleSubmit} disabled={isLoading}>Submit</Button>
        </div>
    );
}

export { AssignLearningMaterialForm };
