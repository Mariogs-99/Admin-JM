import { useState} from "react";
import { Modal, Spin } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Title } from "../../shared/text/title";
import { TableContainer } from "../components/tableReservation/tableContainer";
import { FilterContainer } from "../components/filters/headerFilter/filterContainer";
import { ReservationFormModal } from "./ReservationFormModal";


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
  const [saving, setSaving] = useState(false); 


  const handleCreateOrUpdate = () => {
    setModalOpen(false);
    setSelectedReservation(null);
    setRefresh((prev) => !prev);
  };

  const handleEdit = (reservation: any) => {
    setSelectedReservation(reservation);
    setModalOpen(true);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start pb-6 flex-col md:flex-row md:items-center gap-4">
        <Title>Reservaciones</Title>

        <div className="bg-gray-100 px-4 py-3 rounded-xl shadow-sm flex items-center justify-between gap-6 w-full md:w-auto">
          <div className="flex items-start gap-2 max-w-xs">
            <InfoCircleOutlined className="text-blue-500 text-lg mt-1" />
            <div>
              <div className="font-medium text-sm text-gray-800">
                Emisión de DTE
              </div>
              <p className="text-xs text-gray-500">
                Puedes habilitar la opción de emision de DTE en Configuraciones del hotel
              </p>
            </div>
          </div>
          
        </div>
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
        setLoading={setSaving}
      />

      {/* ✅ Modal de carga con Spinner visible */}
      <Modal
        open={saving}
        footer={null}
        closable={false}
        centered
        maskClosable={false}
        width={300}
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
          <p style={{ marginTop: "15px" }}>Guardando reserva...</p>
        </div>
      </Modal>
    </div>
  );
};
