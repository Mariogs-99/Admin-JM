import { Table, message, Button } from "antd";
import { useState } from "react";
import { SortableTitle } from "../sort/title/sortableTitle";
import { ReservationFormModal } from "../../pages/ReservationFormModal";
import { deleteReservation } from "../../../reservation/services/reservationService";
import { DeleteConfirmationModal } from "../../pages/DeleteConfirmationModal";
import { Reservation } from "../../../reservation/interfaces/Reservation";
import { AssignRoomModal } from "../../pages/AssignRoomModal"; // ✅ nuevo

const parseCreationDate = (value: any): Date => {
  if (Array.isArray(value) && value.length >= 3) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value;
    return new Date(year, month - 1, day, hour, minute, second);
  }
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? new Date(0) : parsed;
};

interface TableUIProps {
  data: Reservation[];
  onReservationUpdated?: () => void;
}

export const TableUI = ({ data, onReservationUpdated }: TableUIProps) => {
  const [sortedInfo, setSortedInfo] = useState<any>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [reservationToAssign, setReservationToAssign] = useState<Reservation | null>(null);

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setReservationToDelete(id);
    setDeleteModalVisible(true);
  };

  const handleAssignClick = (reservation: Reservation) => {
    setReservationToAssign(reservation);
    setAssignModalOpen(true);
  };

  const confirmDelete = async () => {
    if (reservationToDelete !== null) {
      try {
        await deleteReservation(reservationToDelete);
        message.success("Reserva eliminada exitosamente");
        onReservationUpdated?.();
      } catch (error) {
        message.error("Error al eliminar la reserva");
      } finally {
        setDeleteModalVisible(false);
        setReservationToDelete(null);
      }
    }
  };

  const handleChange = (_pagination: any, _filters: any, sorter: any) => {
    setSortedInfo(sorter);
  };

  const ActionButtons = ({ record }: { record: Reservation }) => (
    <div className="flex gap-2">
      <Button type="primary" onClick={() => handleEdit(record)}>
        Editar
      </Button>
      <Button danger onClick={() => handleDeleteClick(record.reservationId)}>
        Eliminar
      </Button>
      <Button onClick={() => handleAssignClick(record)}>
        Asignar habitación
      </Button>
    </div>
  );

  const columns = [
    {
      title: () => (
        <SortableTitle
          title="Huésped"
          sortedColumn={sortedInfo.columnKey === "name" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "name",
      key: "name",
      sorter: (a: Reservation, b: Reservation) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
    },
    {
      title: () => (
        <SortableTitle
          title="Habitación"
          sortedColumn={sortedInfo.columnKey === "room" ? sortedInfo : undefined}
        />
      ),
      dataIndex: ["room", "name"],
      key: "room",
      render: (_: any, record: Reservation) => record.room?.name || "Sin nombre",
    },
    {
      title: () => (
        <SortableTitle
          title="Número de habitación"
          sortedColumn={sortedInfo.columnKey === "roomNumber" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "roomNumber",
      key: "roomNumber",
      sorter: (a: Reservation, b: Reservation) => (a.roomNumber || "").localeCompare(b.roomNumber || ""),
    },
    {
      title: () => (
        <SortableTitle
          title="Fecha inicio"
          sortedColumn={sortedInfo.columnKey === "initDate" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "initDate",
      key: "initDate",
      render: (date: any) => new Date(date).toLocaleDateString("es-ES"),
      sorter: (a: Reservation, b: Reservation) => new Date(a.initDate).getTime() - new Date(b.initDate).getTime(),
    },
    {
      title: () => (
        <SortableTitle
          title="Fecha fin"
          sortedColumn={sortedInfo.columnKey === "finishDate" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "finishDate",
      key: "finishDate",
      render: (date: any) => new Date(date).toLocaleDateString("es-ES"),
      sorter: (a: Reservation, b: Reservation) => new Date(a.finishDate).getTime() - new Date(b.finishDate).getTime(),
    },
    {
      title: () => (
        <SortableTitle
          title="Habitaciones reservadas"
          sortedColumn={sortedInfo.columnKey === "quantityReserved" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "quantityReserved",
      key: "quantityReserved",
      sorter: (a: Reservation, b: Reservation) => a.quantityReserved - b.quantityReserved,
    },
    {
      title: () => (
        <SortableTitle
          title="Capacidad"
          sortedColumn={sortedInfo.columnKey === "cantPeople" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "cantPeople",
      key: "cantPeople",
      sorter: (a: Reservation, b: Reservation) => a.cantPeople - b.cantPeople,
    },
    {
      title: () => (
        <SortableTitle
          title="Teléfono"
          sortedColumn={sortedInfo.columnKey === "phone" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: () => (
        <SortableTitle
          title="Pago"
          sortedColumn={sortedInfo.columnKey === "payment" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "payment",
      key: "payment",
      render: (payment: number) => `$${payment.toFixed(2)}`,
      sorter: (a: Reservation, b: Reservation) => a.payment - b.payment,
    },
    {
      title: () => (
        <SortableTitle
          title="Creación"
          sortedColumn={sortedInfo.columnKey === "creationDate" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "creationDate",
      key: "creationDate",
      render: (value: any) => {
        const date = parseCreationDate(value);
        return date.toLocaleString("es-ES");
      },
      sorter: (a: Reservation, b: Reservation) =>
        parseCreationDate(a.creationDate).getTime() - parseCreationDate(b.creationDate).getTime(),
    },
    {
      title: () => (
        <SortableTitle
          title="Estado"
          sortedColumn={sortedInfo.columnKey === "status" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "status",
      key: "status",
      sorter: (a: Reservation, b: Reservation) => a.status.localeCompare(b.status),
      render: (status: string) => {
        let color = "gray";
        let label = status;

        if (status === "FINALIZADA") {
          color = "green";
          label = "Finalizada";
        } else if (status === "ACTIVA") {
          color = "blue";
          label = "Activa";
        } else if (status === "FUTURA") {
          color = "orange";
          label = "Futura";
        }

        return <span style={{ color, fontWeight: "bold" }}>{label}</span>;
      },
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Reservation) => <ActionButtons record={record} />,
    },
  ];

  return (
    <>
      <Table
        dataSource={(data ?? []).map((item) => ({ ...item, key: item.reservationId }))}
        columns={columns}
        pagination={{ pageSize: 6 }}
        onChange={handleChange}
      />

      <ReservationFormModal
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSubmit={() => {
          setModalOpen(false);
          onReservationUpdated?.();
        }}
        initialData={selectedReservation}
      />

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />

      {reservationToAssign && (
        <AssignRoomModal
          visible={assignModalOpen}
          reservationId={reservationToAssign.reservationId}
          onCancel={() => setAssignModalOpen(false)}
          onSuccess={() => {
            setAssignModalOpen(false);
            onReservationUpdated?.();
          }}
        />
      )}
    </>
  );
};
