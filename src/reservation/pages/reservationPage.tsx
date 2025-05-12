import React, { useState } from "react";
import { Title } from "../../shared/text/title";
import { TableContainer } from "../components/tableReservation/tableContainer";
import { FilterContainer } from "../components/filters/headerFilter/filterContainer";


export const ReservationPage = () => {
    const [results, setResults] = useState<number>(0);
    const [filters, setFilters] = useState<any>({});
    
    return (
        <div className="card">
            <Title className="pb-10">Booking</Title>
            {/*contenedor de los filtros y busqueda */}
            <FilterContainer results={results} setFilters={setFilters} />
            {/* TableContainer: obtiene los datos de las reservas */}
            <TableContainer setResults={setResults} filters={filters} />
        </div>
    );
};