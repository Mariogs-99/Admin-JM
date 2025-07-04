import { Table, message, Button, Dropdown, Menu, Tooltip } from "antd";
import { useState } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { SortableTitle } from "../sort/title/sortableTitle";
import { ReservationFormModal } from "../../pages/ReservationFormModal";
import { deleteReservation } from "../../../reservation/services/reservationService";
import { DeleteConfirmationModal } from "../../pages/DeleteConfirmationModal";
import { Reservation } from "../../../reservation/interfaces/Reservation";
import { AssignRoomModal } from "../../pages/AssignRoomModal";

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
  onEdit: (reservation: Reservation) => void;
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

  const ActionButtons = ({ record }: { record: Reservation }) => {
    const menu = (
      <Menu>
        <Menu.Item onClick={() => handleEdit(record)}>Editar</Menu.Item>
        <Menu.Item danger onClick={() => handleDeleteClick(record.reservationId)}>Eliminar</Menu.Item>
        <Menu.Item onClick={() => handleAssignClick(record)}>Asignar habitación</Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button icon={<MoreOutlined />} />
      </Dropdown>
    );
  };

  const columns = [
    {
      title: () => <SortableTitle title="Código de reserva" />,
      dataIndex: "reservationCode",
      key: "reservationCode",
      render: (code: string | null) => {
        const safeCode = code || "-";
        return (
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>{safeCode}</span>
            <Button
              size="small"
              disabled={safeCode === "-"}
              onClick={() => {
                navigator.clipboard.writeText(safeCode);
                message.success("Código copiado");
              }}
            >
              Copiar
            </Button>
          </div>
        );
      },
    },
    {
      title: () => (
        <SortableTitle
          title="Huésped"
          sortedColumn={sortedInfo.columnKey === "name" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "name",
      key: "name",
      sorter: (a: Reservation, b: Reservation) =>
        (a.name || "").localeCompare(b.name || ""),
      sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
      render: (name: string | null) => name || "-",
    },
    {
      title: () => <SortableTitle title="Resumen" />,
      key: "summary",
      render: (_: any, record: Reservation) => {
        let habitaciones = "Sin habitaciones";
        let asignadas = "Sin asignar";

        if (record.rooms && record.rooms.length > 0) {
          habitaciones = record.rooms
            .map((r) => `${r.roomName} × ${r.quantity}`)
            .join(", ");
          asignadas =
            record.rooms
              .map((r) => r.assignedRoomNumber)
              .filter((n) => n?.trim())
              .join(", ") || "Sin asignar";
        } else if (record.room) {
          habitaciones = record.room.nameEs || "Sin habitaciones";
          asignadas = record.roomNumber || "Sin asignar";
        }

        return (
          <>
            <div><b>Habitacion:</b> {habitaciones}</div>
            <div><b>N# Habitacion:</b> {asignadas}</div>
            <div><b>Personas:</b> {record.cantPeople ?? "-"}</div>
          </>
        );
      },
    },
    {
      title: () => <SortableTitle title="Fecha inicio" />,
      dataIndex: "initDate",
      key: "initDate",
      render: (date: any) =>
        date ? new Date(date).toLocaleDateString("es-ES") : "-",
      sorter: (a: Reservation, b: Reservation) =>
        new Date(a.initDate || 0).getTime() - new Date(b.initDate || 0).getTime(),
    },
    {
      title: () => <SortableTitle title="Fecha fin" />,
      dataIndex: "finishDate",
      key: "finishDate",
      render: (date: any) =>
        date ? new Date(date).toLocaleDateString("es-ES") : "-",
      sorter: (a: Reservation, b: Reservation) =>
        new Date(a.finishDate || 0).getTime() - new Date(b.finishDate || 0).getTime(),
    },
    {
      title: () => <SortableTitle title="Correo" />,
      dataIndex: "email",
      key: "email",
      render: (email: string | null) => {
        const safeEmail = email || "-";
        return (
          <div className="flex items-center gap-2">
            <Tooltip title={safeEmail}>
              <span>{safeEmail.length > 25 ? safeEmail.slice(0, 22) + "..." : safeEmail}</span>
            </Tooltip>
            <Button
              size="small"
              disabled={safeEmail === "-"}
              onClick={() => {
                navigator.clipboard.writeText(safeEmail);
                message.success("Correo copiado");
              }}
            >
              Copiar
            </Button>
          </div>
        );
      },
    },
    {
      title: () => <SortableTitle title="Pago" />,
      dataIndex: "payment",
      key: "payment",
      render: (payment: number | null) =>
        payment != null ? `$${payment.toFixed(2)}` : "-",
      sorter: (a: Reservation, b: Reservation) =>
        (a.payment || 0) - (b.payment || 0),
    },
    {
      title: () => <SortableTitle title="Creación" />,
      dataIndex: "creationDate",
      key: "creationDate",
      render: (value: any) => {
        const date = parseCreationDate(value);
        return date.toLocaleDateString("es-ES");
      },
      sorter: (a: Reservation, b: Reservation) =>
        parseCreationDate(a.creationDate).getTime() -
        parseCreationDate(b.creationDate).getTime(),
    },
    {
      title: () => <SortableTitle title="Estado" />,
      dataIndex: "status",
      key: "status",
      sorter: (a: Reservation, b: Reservation) =>
        (a.status || "").localeCompare(b.status || ""),
      render: (status: string | null) => {
        const safeStatus = status || "-";
        let color = "gray";
        let label = safeStatus;

        if (safeStatus === "FINALIZADA") {
          color = "green";
          label = "Finalizada";
        } else if (safeStatus === "ACTIVA") {
          color = "blue";
          label = "Activa";
        } else if (safeStatus === "FUTURA") {
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
        dataSource={data.map((item) => ({ ...item, key: item.reservationId }))}
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
          reservation={reservationToAssign}
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
