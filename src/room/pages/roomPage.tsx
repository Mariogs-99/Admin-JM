import { useState } from "react";
import { Title } from "../../shared/text/title";
import { RoomList } from "../components/roomList/roomList";
import { FilterContainer } from "../components/filter/headerFilter/FilterContainer";

function RoomPage() {
    const [results, setResults] = useState<number>(0);
    const [filters, setFilters] = useState<{ searchTerm?: string }>({});

    return (
        <>
            <span className="flex justify-between pb-5">
                <Title>Habitaciones</Title>
            </span>
            <FilterContainer results={results} setFilters={setFilters} />
            <div className="grid gap-10 pb-5">
                <RoomList setResults={setResults} filter={filters} />
            </div>
        </>
    )
}

export default RoomPage;