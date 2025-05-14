import React, { useState } from "react";
import { Title } from "../../shared/text/title";
import { TableContainer } from "../components/tableReservation/tableContainer";
import { FilterContainer } from "../components/filters/headerFilter/filterContainer";
import { ReservationFormModal } from "./ReservationFormModal";// Asegúrate de que la ruta sea correcta
import { SaveReservations } from "../services/reservationService";
import { message } from "antd";


export const ReservationPage = () => {
  const [results, setResults] = useState<number>(0);
  const [filters, setFilters] = useState<any>({});
  const [modalOpen, setModalOpen] = useState(false); 

 const handleCreateReservation = () => {
  setModalOpen(false);
  window.location.reload(); 
};

  return (
    <div className="card">
      <Title className="pb-10">Booking</Title>

      <FilterContainer
        results={results}
        setFilters={setFilters}
        onAdd={() => setModalOpen(true)} //Activador del modal
      />

      <TableContainer setResults={setResults} filters={filters} />

      <ReservationFormModal
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleCreateReservation}
      />
    </div>
  );
};
