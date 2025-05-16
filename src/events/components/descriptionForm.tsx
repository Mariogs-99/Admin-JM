import { EventDTO } from "../services/eventServices";
import { EventCardInformation } from "./EventCardInformation";

export const DescriptionForm = ({
  events,
  onEdit,
  onDelete,
}: {
  events: EventDTO[];
  onEdit: (event: EventDTO) => void;
  onDelete: (event: EventDTO) => void; // ✅ se ajusta aquí también
}) => {
  return (
    <div className="mt-6">
      <EventCardInformation
        data={events}
        onEdit={onEdit}
        onDelete={onDelete} // ✅ ya se pasa el objeto
      />
    </div>
  );
};
