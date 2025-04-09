
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OPERATION_URLS } from "@/constants";
import { ProcedureSearchResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";


function SearchProcedureByCode({ onSelect }: { onSelect: (procedure: ProcedureSearchResult) => void }) {
    const [searchResults, setSearchResults] = useState<ProcedureSearchResult[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [clicked, setClicked] = useState<string | null>(null);

    const onSearchTextChanged = async (text: string) => {
        setSearchText(text);
        if (text.length > 1) {
            const options = {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "codePrefix": text
                })
            };
            const response = await fetch(OPERATION_URLS.SEARCH_CPTCODE_BY_CODE, options);
            if (response.ok) {
                const list: ProcedureSearchResult[] = await response.json();
                if (list) {
                    setSearchResults(list.slice(0, 10));
                }
            } else {
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    }

    return (
        <div className="p-4 space-y-4">
            <Input placeholder="Search for a code..." onChange={e => onSearchTextChanged(e.target.value)} />
            {searchText.length > 1 && searchResults.length == 0 && <p>No search results match</p>}
            {searchText.length <= 1 && <p>Type at least 2 numbers to start searching</p>}
            <ScrollArea className="max-h-96 w-full">
                <div className="space-y-4 p-2">
                    {
                        searchResults.map((procedure) => (
                            <Card
                                key={procedure.id}
                                className={cn(
                                    "border shadow-md rounded-lg p-4 transition-transform duration-300 cursor-pointer",
                                    clicked === procedure.id ? "scale-95 bg-gray-100" : "hover:scale-105"
                                )}
                                onClick={() => {
                                    onSelect(procedure);
                                    setClicked(procedure.id);
                                    toast("Search Result Selected", {
                                        description: "You can close this search popup",
                                        action: {
                                            label: "Close",
                                            onClick: () => { },
                                        },
                                    })
                                }}
                            >
                                <CardContent>
                                    <h3 className="text-lg font-semibold mb-2">{procedure.code}</h3>
                                    <p className="text-sm text-gray-700">{procedure.description}</p>
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>
            </ScrollArea>
        </div>
    );
}

export default SearchProcedureByCode;
