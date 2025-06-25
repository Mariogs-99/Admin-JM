import { useState } from "react";
import { Title } from "../../shared/text/title";
import { TableContainer } from "../components/tableReservation/tableContainer";
import { FilterContainer } from "../components/filters/headerFilter/filterContainer";
import { ReservationFormModal } from "./ReservationFormModal";
import { useReservationSocketWithCount } from "../../hooks/useReservationSocket";
import { NotificationBell } from "./NotificationBell";
import { notification } from "antd";
import type { ReservationNotificationDTO } from "../../hooks/useReservationSocket";

interface ReservationFilters {
  room?: { name: string };
  startDate?: string;
  endDate?: string;
  reservationCode?: string;
}

export const ReservationPage = () => {
  const [results, setResults] = useState<number>(0);
  const [filters, setFilters] = useState<ReservationFilters>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [lastReservation, setLastReservation] = useState<any>(null);
  const [api, contextHolder] = notification.useNotification();

  //?Notificacion reserva

    const showNotification = (data: ReservationNotificationDTO) => {
      api.info({
        message: "Nueva reservación",
        description: `El cliente ${data.name} ha realizado una reservación (Código: ${data.reservationCode}).`,
        placement: "topRight",
        duration: 6,
      });
    };



  // ✅ Hook que escucha WebSocket y actualiza automáticamente
  const { count, clearCount } = useReservationSocketWithCount((data) => {
    setLastReservation(data);
    showNotification(data);
    setRefresh((prev) => !prev);
  });
  const handleCreateOrUpdate = () => {
    setModalOpen(false);
    setSelectedReservation(null);
    setRefresh((prev) => !prev);
  };

  const handleEdit = (reservation: any) => {
    setSelectedReservation(reservation);
    setModalOpen(true);
  };

  const handleNotificationClick = () => {
    if (lastReservation) {
      showNotification(lastReservation);
      clearCount();
    }
  };

  return (
    <>
      {contextHolder}
      <div className="card">
        <div className="flex justify-between items-center pb-10">
          <Title>Reservaciones</Title>
          <NotificationBell count={count} onClick={handleNotificationClick} />
        </div>

        <FilterContainer
          results={results}
          setFilters={setFilters}
          onAdd={() => setModalOpen(true)}
        />

        <TableContainer
          setResults={setResults}
          filters={filters}
          refresh={refresh}
          onEdit={handleEdit}
        />

        <ReservationFormModal
          visible={modalOpen}
          onCancel={() => {
            setModalOpen(false);
            setSelectedReservation(null);
          }}
          onSubmit={handleCreateOrUpdate}
          initialData={selectedReservation}
        />
      </div>
    </>
  );
};
