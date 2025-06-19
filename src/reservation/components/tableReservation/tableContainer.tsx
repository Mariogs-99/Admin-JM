import { useEffect, useState } from "react";
import { GetReservations } from "../../services/reservationService";
import { Reservation } from "../../interfaces/Reservation";
import { TableUI } from "./tableUI";

interface ReservationFilters {
  roomName?: string;
  startDate?: string;
  endDate?: string;
  reservationCode?: string; // ✅ Nuevo filtro
}

interface TableContainerProps {
  setResults: (count: number) => void;
  filters: ReservationFilters;
  refresh: boolean;
  onEdit: (reservation: Reservation) => void;
}

export const TableContainer = ({
  setResults,
  filters,
  refresh,
  onEdit,
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

    if (filters.roomName) {
      const term = filters.roomName.toLowerCase();
      filtered = filtered.filter((r) =>
        r.rooms?.some((room) =>
          room.roomName.toLowerCase().includes(term)
        )
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

    if (filters.reservationCode) {
      const code = filters.reservationCode.trim().toLowerCase();
      filtered = filtered.filter((r) =>
        r.reservationCode.toLowerCase().includes(code)
      );
    }

    setFilteredReservations(filtered);
    setResults(filtered.length);
  };

  return (
    <TableUI
      data={filteredReservations}
      onReservationUpdated={fetchReservations}
      onEdit={onEdit}
    />
  );
};
