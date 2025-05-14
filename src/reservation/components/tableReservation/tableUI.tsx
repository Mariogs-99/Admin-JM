import { Table, message } from "antd";
import { useEffect, useState } from "react";
import { SortableTitle } from "../sort/title/sortableTitle";
import { formatDate } from "../../../utils/formatDate";
import "./tableUI.css";
import { ReservationFormModal } from "../../pages/ReservationFormModal";
import { deleteReservation } from "../../../reservation/services/reservationService";
import { DeleteConfirmationModal } from "../../pages/DeleteConfirmationModal"; // Asegúrate de la ruta

export const TableUI = ({
  data,
  onReservationUpdated,
}: {
  data: any;
  onReservationUpdated?: () => void;
}) => {
  const [sortedInfo, setSortedInfo] = useState<any>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(null);

  const handleEdit = (reservation: any) => {
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

  const columns = [
    {
      title: () => (
        <SortableTitle
          title="Huésped"
          sortedColumn={sortedInfo?.columnKey === "name" ? sortedInfo : undefined}
        />
      ),
      dataIndex: ["name"],
      key: "name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
    },
    {
      title: () => (
        <SortableTitle
          title="Habitación"
          sortedColumn={sortedInfo?.columnKey === "nameEs" ? sortedInfo : undefined}
        />
      ),
      dataIndex: ["room", "nameEs"],
      key: "nameEs",
      sorter: (a: any, b: any) => a.room.nameEs.localeCompare(b.room.nameEs),
      sortOrder: sortedInfo.columnKey === "nameEs" && sortedInfo.order,
    },
    {
      title: () => (
        <SortableTitle
          title="Fecha inicio"
          sortedColumn={sortedInfo?.columnKey === "initDate" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "initDate",
      key: "initDate",
      render: formatDate,
      sorter: (a: any, b: any) =>
        new Date(a.initDate).getTime() - new Date(b.initDate).getTime(),
      sortOrder: sortedInfo.columnKey === "initDate" && sortedInfo.order,
    },
    {
      title: () => (
        <SortableTitle
          title="Fecha fin"
          sortedColumn={sortedInfo?.columnKey === "finishDate" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "finishDate",
      key: "finishDate",
      render: formatDate,
      sorter: (a: any, b: any) =>
        new Date(a.finishDate).getTime() - new Date(b.finishDate).getTime(),
      sortOrder: sortedInfo.columnKey === "finishDate" && sortedInfo.order,
    },
    {
      title: () => (
        <SortableTitle
          title="Categoría"
          sortedColumn={sortedInfo?.columnKey === "categoryEs" ? sortedInfo : undefined}
        />
      ),
      dataIndex: ["categoryroom", "nameCategoryEs"],
      key: "categoryEs",
      sorter: (a: any, b: any) =>
        a.categoryroom.nameCategoryEs.localeCompare(b.categoryroom.nameCategoryEs),
      sortOrder: sortedInfo.columnKey === "categoryEs" && sortedInfo.order,
    },
    {
      title: () => (
        <SortableTitle
          title="Pago"
          sortedColumn={sortedInfo?.columnKey === "payment" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "payment",
      key: "payment",
      render: (payment: number) => `$${payment.toFixed(2)}`,
      sorter: (a: any, b: any) => a.payment - b.payment,
      sortOrder: sortedInfo.columnKey === "payment" && sortedInfo.order,
    },
    {
      title: () => (
        <SortableTitle
          title="Cant. personas"
          sortedColumn={sortedInfo?.columnKey === "cantPeople" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "cantPeople",
      key: "cantPeople",
      sorter: (a: any, b: any) => a.cantPeople - b.cantPeople,
      sortOrder: sortedInfo.columnKey === "cantPeople" && sortedInfo.order,
    },
    {
      title: "Teléfono",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => handleEdit(record)}
          >
            Editar
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded"
            onClick={() => handleDeleteClick(record.reservationId)}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={data.map((item: any) => ({ ...item, key: item.reservationId }))}
        columns={columns}
        pagination={{ pageSize: 6 }}
        onChange={handleChange}
      />

 <ReservationFormModal
  visible={modalOpen}
  onCancel={() => setModalOpen(false)}
  onSubmit={() => {
    setModalOpen(false);           // ✅ Cierra el modal después de guardar
    onReservationUpdated?.();      // ✅ Recarga los datos
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
