
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OPERATION_URLS } from "@/constants";
import { Role, UserSearchResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";


function PersonSearch({ onSelect }: { onSelect: (resident: UserSearchResult) => void }) {
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [clicked, setClicked] = useState<string | null>(null);

    const onSearchTextChanged = async (text: string) => {
        setSearchText(text);
        if (text.length > 0) {
            // const options = {
            //     method: 'POST',
            //     headers: { "Content-Type": "application/json" },
            //     credentials: 'include',
            //     body: JSON.stringify({
            //         // "token": localStorage.getItem('token'),
            //         "fullNamePrefix": text
            //     })
            // };
            const response = await fetch(OPERATION_URLS.SEARCH_USER, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({
                    // "token": localStorage.getItem('token'),
                    "fullNamePrefix": text
                })
            });
            if (response.ok) {
                const list: UserSearchResult[] = await response.json();
                if (list) {
                    setSearchResults(list.filter(user => user.role != Role.PHYSICIAN).slice(0, 10));
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
            <Input placeholder="Search for a resident..." onChange={e => onSearchTextChanged(e.target.value)} />
            {searchText.length > 1 && searchResults.length == 0 && <p>No search results match</p>}
            <ScrollArea className="max-h-96 w-full">
                <div className="space-y-4 p-2">
                    {
                        searchResults.map((resident) => (
                            <Card
                                key={resident.id}
                                className={cn(
                                    "border shadow-md rounded-lg p-4 transition-transform duration-300 cursor-pointer",
                                    clicked === resident.id ? "scale-95 bg-gray-100" : "hover:scale-105"
                                )}
                                onClick={() => {
                                    onSelect(resident);
                                    setClicked(resident.id);
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
                                    <h3 className="text-lg font-semibold mb-2">{resident.fullName}</h3>
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>
            </ScrollArea>
        </div>
    );
}

export default PersonSearch;
