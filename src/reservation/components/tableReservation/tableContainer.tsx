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

    //*Obtiene todas las reservas del backend
    const fetchReservations = async () => {
        try {
            const response = await GetReservations();
            setReservations(response);
            setResults(response.length);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    //*Aplica los filtros a las reservas
    const applyFilters = () => {
        let filtered = reservations;

        if (filters.room) {
            filtered = filtered.filter((r) => r.room.nameEs === filters.room.name);
        }
        if (filters.category) {
            filtered = filtered.filter((r) => r.categoryroom.nameCategoryEs === filters.category.name);
        }
        if (filters.startDate) {
            filtered = filtered.filter((r) => {
                const initDate = new Date(r.initDate[0], r.initDate[1] - 1, r.initDate[2]);
                return initDate >= new Date(filters.startDate);
            });
        }
        if (filters.endDate) {
            filtered = filtered.filter((r) => {
                const finishDate = new Date(r.finishDate[0], r.finishDate[1] - 1, r.finishDate[2]);
                return finishDate <= new Date(filters.endDate);
            });
        }

        setFilteredReservations(filtered);
        setResults(filtered.length);
    };

    return (
        <TableUI
            data={filteredReservations}
            onReservationUpdated={fetchReservations} // 👈 Para actualizar la tabla tras editar o eliminar
        />
    );
};
