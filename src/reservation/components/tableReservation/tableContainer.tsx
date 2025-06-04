import React, { useEffect, useState } from "react";
import { GetReservations } from "../../services/reservationService";
import { Reservation } from "../../interfaces/Reservation";
import { TableUI } from "./tableUI";

interface ReservationFilters {
  room?: { name: string };
  startDate?: string;
  endDate?: string;
}

interface TableContainerProps {
  setResults: (count: number) => void;
  filters: ReservationFilters;
  refresh: boolean;
}

export const TableContainer = ({
  setResults,
  filters,
  refresh,
}: TableContainerProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    fetchReservations();
  }, [refresh]);

  useEffect(() => {
    applyFilters();
  }, [filters, reservations]);

  const fetchReservations = async () => {
    try {
      const response = await GetReservations();
      setReservations(response);
    } catch (error) {
      console.error("Error al obtener las reservas:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...reservations];

    if (filters.room?.name) {
      filtered = filtered.filter((r) =>
        r.room?.name?.toLowerCase().includes(filters.room!.name.toLowerCase())
      );
    }

    if (filters.startDate) {
      const start = new Date(filters.startDate);
      filtered = filtered.filter((r) => new Date(r.initDate) >= start);
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate);
      filtered = filtered.filter((r) => new Date(r.finishDate) <= end);
    }

    setFilteredReservations(filtered);
    setResults(filtered.length);
  };

  return (
    <TableUI
      data={filteredReservations}
      onReservationUpdated={fetchReservations}
    />
  );
};
