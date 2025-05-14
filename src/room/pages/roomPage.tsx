import { useState } from "react";
import { Title } from "../../shared/text/title";
import { RoomList } from "../components/roomList/roomList";
import { FilterContainer } from "../components/filter/headerFilter/FilterContainer";
import { RoomFormModal } from "./RoomFormModal";
import { RoomCard } from "../interfaces/roomInterface";
import { DeleteModal } from "./DeleteConfModal";
import { DeleteRoom } from "../services/roomServices";
import { message } from "antd";

function RoomPage() {
  const [results, setResults] = useState<number>(0);
  const [filters, setFilters] = useState<{ searchTerm?: string }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<RoomCard | null>(null);
  const [refresh, setRefresh] = useState(false);

  // Estado para eliminación
  const [deleteRoomId, setDeleteRoomId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleRoomCreatedOrUpdated = () => {
    setModalOpen(false);
    setRoomToEdit(null);
    setRefresh(prev => !prev);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setRoomToEdit(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteRoomId != null) {
      try {
        await DeleteRoom(deleteRoomId);
        message.success("Habitación eliminada correctamente");
        setRefresh(prev => !prev);
      } catch (err) {
        message.error("Error al eliminar habitación");
      } finally {
        setDeleteModalOpen(false);
        setDeleteRoomId(null);
      }
    }
  };

  return (
    <div className="card">
      <Title className="pb-10">Habitaciones</Title>

      <FilterContainer
        results={results}
        setFilters={setFilters}
        onAdd={() => {
          setRoomToEdit(null);
          setModalOpen(true);
        }}
      />

      <RoomList
        setResults={setResults}
        filter={filters}
        refetchTrigger={refresh}
        setRoomToEdit={setRoomToEdit}
        setModalOpen={setModalOpen}
        onDeleteRoom={(roomId: number) => {
          setDeleteRoomId(roomId);
          setDeleteModalOpen(true);
        }}
      />

      <RoomFormModal
        visible={modalOpen}
        onCancel={handleCancel}
        onSubmit={handleRoomCreatedOrUpdated}
        initialData={roomToEdit}
      />

      <DeleteModal
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        entityName="esta habitación"
      />
    </div>
  );
}

export default RoomPage;
