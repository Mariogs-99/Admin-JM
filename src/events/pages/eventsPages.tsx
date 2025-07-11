import { useEffect, useState } from "react";
import { Title } from "../../shared/text/title";
import { DescriptionForm } from "../components/descriptionForm";
import {
  EventDTO,
  GetAllEventsAdmin, // ✅ Usamos este
  DeleteEvent,
} from "../services/eventServices";
import { EventFilterContainer } from "../services/FilterContainer";
import { EventFormModal } from "./EventFormModal";
import Swal from "sweetalert2";

function EventPage() {
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventDTO | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await GetAllEventsAdmin(); // ✅ usamos el endpoint que devuelve TODOS
      setEvents(response);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
    }
  };

  const handleEdit = (event: EventDTO) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (event: EventDTO) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar evento?",
      text: `¿Estás seguro de eliminar "${event.titleEs}"? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed && event.id) {
      try {
        await DeleteEvent(event.id);
        await fetchEvents(); // Recargar los datos
        Swal.fire("Eliminado", "El evento ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error al eliminar evento:", error);
        Swal.fire("Error", "No se pudo eliminar el evento.", "error");
      }
    }
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-7">
      <Title>Eventos</Title>

      {/* Filtro y botón Agregar */}
      <EventFilterContainer results={events.length} onAdd={handleAdd} />

      {/* Lista de eventos en tabla */}
      <DescriptionForm
        events={events}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal para crear/editar evento */}
      <EventFormModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchEvents}
        initialData={editingEvent}
      />
    </div>
  );
}

export default EventPage;
