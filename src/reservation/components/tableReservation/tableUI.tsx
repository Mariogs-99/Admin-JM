import { Table, message, Button } from "antd";
import { useState } from "react";
import { SortableTitle } from "../sort/title/sortableTitle";
import { formatDate } from "../../../utils/formatDate";
import { ReservationFormModal } from "../../pages/ReservationFormModal";
import { deleteReservation } from "../../../reservation/services/reservationService";
import { DeleteConfirmationModal } from "../../pages/DeleteConfirmationModal";
import { Reservation } from "../../../reservation/interfaces/Reservation";

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

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setReservationToDelete(id);
    setDeleteModalVisible(true);
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
      dataIndex: ["room", "nameEs"],
      key: "room",
      render: (_: any, record: Reservation) => record.room?.nameEs || "Sin nombre",
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
      render: formatDate,
      sorter: (a: Reservation, b: Reservation) =>
        new Date(a.initDate).getTime() - new Date(b.initDate).getTime(),
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
      render: formatDate,
      sorter: (a: Reservation, b: Reservation) =>
        new Date(a.finishDate).getTime() - new Date(b.finishDate).getTime(),
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
      sorter: (a: Reservation, b: Reservation) =>
        a.quantityReserved - b.quantityReserved,
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
      render: formatDate,
      sorter: (a: Reservation, b: Reservation) =>
        new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime(),
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
    </>
  );
};
