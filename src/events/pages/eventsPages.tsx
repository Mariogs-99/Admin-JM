import { useEffect, useState } from "react";
import { Title } from "../../shared/text/title";
import { DescriptionForm } from "../components/descriptionForm";
import { EventDTO, GetEvents } from "../services/eventServices";
import { EventFilterContainer } from "../services/FilterContainer";
import { EventFormModal } from "./EventFormModal";
import Swal from "sweetalert2";

function EventPage() {
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventDTO | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await GetEvents();
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
      text: `¿Estás seguro de eliminar "${event.title}"? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      // await DeleteEvent(event.id); // <- descomenta cuando tengas tu API real
      console.log("Evento eliminado:", event.id);
      await fetchEvents();
    }
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-7">
      <Title>Gestión de eventos</Title>

      {/* Filtro y botón Agregar */}
      <EventFilterContainer results={events.length} onAdd={handleAdd} />

      {/* Lista de eventos en tabla */}
      <DescriptionForm
        events={events}
        onEdit={handleEdit}
        onDelete={handleDelete} // ✅ ahora recibe el evento completo
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
