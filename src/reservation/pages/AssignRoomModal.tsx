import { Modal, Form, Input, message, Row, Col } from "antd";
import { useState, useEffect } from "react";
import { assignRoomNumbers, RoomAssignment } from "../services/reservationService";
import { Reservation } from "../interfaces/Reservation";

interface AssignRoomModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  reservation: Reservation | null;
}

export const AssignRoomModal = ({
  visible,
  onCancel,
  onSuccess,
  reservation,
}: AssignRoomModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    if (reservation && visible) {
      const initialValues: any = {};
      reservation.rooms?.forEach((room, index) => {
        initialValues[`room_${index}`] = room.assignedRoomNumber || "";
      });
      form.setFieldsValue(initialValues);
    }
  }, [reservation, visible]);

  const handleAssign = async () => {
    try {
      const values = await form.validateFields();
      if (!reservation) return;

      // ✅ Validación de duplicados locales
      const assignedNumbers = reservation.rooms.map((_, index) => values[`room_${index}`]?.trim());
      const duplicates = assignedNumbers.filter(
        (item, index) => item && assignedNumbers.indexOf(item) !== index
      );
      if (duplicates.length > 0) {
        message.error("No puedes asignar el mismo número de habitación más de una vez.");
        return;
      }

      const payload: RoomAssignment[] = reservation.rooms.map((room, index) => ({
        roomId: room.roomId,
        quantity: room.quantity,
        assignedRoomNumber: values[`room_${index}`] || "",
      }));

      setLoading(true);
      await assignRoomNumbers(reservation.reservationId, payload);
      message.success("Habitaciones asignadas correctamente");
      form.resetFields();
      setBackendError(null);
      onSuccess();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Error al asignar habitaciones";
      setBackendError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title="Asignar habitaciones"
      onCancel={() => {
        form.resetFields();
        setBackendError(null);
        onCancel();
      }}
      onOk={handleAssign}
      okText="Asignar"
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        {reservation?.rooms?.map((room, index) => (
          <Row key={index} gutter={8}>
            <Col span={16}>
              <Form.Item
                label={`${room.roomName} × ${room.quantity}`}
                name={`room_${index}`}
                rules={[{ required: true, message: "Número requerido" }]}
              >
                <Input placeholder="Ej. 101, 102A, etc." />
              </Form.Item>
            </Col>
          </Row>
        ))}

        {backendError && (
          <div
            style={{
              color: "#ff4d4f",
              backgroundColor: "#fff1f0",
              border: "1px solid #ffa39e",
              borderRadius: "6px",
              padding: "8px 12px",
              marginTop: "12px",
            }}
          >
            ⚠️ {backendError}
          </div>
        )}
      </Form>
    </Modal>
  );
};
