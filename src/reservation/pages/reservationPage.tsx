import { useState } from "react";
import { Title } from "../../shared/text/title";
import { TableContainer } from "../components/tableReservation/tableContainer";
import { FilterContainer } from "../components/filters/headerFilter/filterContainer";
import { ReservationFormModal } from "./ReservationFormModal";

interface ReservationFilters {
  room?: { name: string };
  startDate?: string;
  endDate?: string;
}

export const ReservationPage = () => {
  const [results, setResults] = useState<number>(0);
  const [filters, setFilters] = useState<ReservationFilters>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleCreateOrUpdate = () => {
    setModalOpen(false);
    setRefresh((prev) => !prev);
  };

  return (
    <div className="card">
      <Title className="pb-10">Reservaciones</Title>

      <FilterContainer
        results={results}
        setFilters={setFilters}
        onAdd={() => setModalOpen(true)}
      />

      <TableContainer
        setResults={setResults}
        filters={filters}
        refresh={refresh}
      />

      <ReservationFormModal
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
      />
    </div>
  );
};
