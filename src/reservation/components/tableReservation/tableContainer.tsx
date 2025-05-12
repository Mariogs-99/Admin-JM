import React, { useEffect, useState } from "react";
import { GetReservations } from "../../services/reservationService";
import { Reservation } from "../../interfaces/Reservation";
import { TableUI } from "./tableUI";



export const TableContainer = ({ setResults, filters }: { setResults: any; filters: any }) => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);

    useEffect(() => {
        fetchReservations();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, reservations]);

    const fetchReservations = async () => {
        try {
            const response = await GetReservations();
            setReservations(response);
            setResults(response.length);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    const applyFilters = () => {
        let filtered = reservations;
        console.log("filtered", filtered)

        if (filters.room) {
            console.log("filtered", filtered)
            filtered = filtered.filter((r) => r.room.nameEs === filters.room.name);
        }
        if (filters.category) {
            filtered = filtered.filter((r) => r.categoryroom.nameCategoryEs === filters.category.name);

        }
        if (filters.startDate) {
            filtered = filtered.filter((r) => {
                const initDate = new Date(r.initDate[0], r.initDate[1] - 1, r.initDate[2]); // Año, mes (0-indexed), día
                return initDate >= new Date(filters.startDate);
            });
        }
        if (filters.endDate) {
            filtered = filtered.filter((r) => {
                const finishDate = new Date(r.finishDate[0], r.finishDate[1] - 1, r.finishDate[2]); // Año, mes (0-indexed), día
                return finishDate <= new Date(filters.endDate);
            });
        }
        console.log("filtered2", filtered)
        setFilteredReservations(filtered);
        setResults(filtered.length);
    }


    return (
        <TableUI data={filteredReservations} /> //muestra los datos en la tabla
    )
}