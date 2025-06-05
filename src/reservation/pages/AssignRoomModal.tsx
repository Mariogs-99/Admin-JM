import { Modal, Form, Input, Button, message } from "antd";
import { useState } from "react";
import { assignRoomNumber } from "../services/reservationService";

interface AssignRoomModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  reservationId: number | null;
}

export const AssignRoomModal = ({
  visible,
  onCancel,
  onSuccess,
  reservationId,
}: AssignRoomModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  const handleAssign = async () => {
    try {
      const { roomNumber } = await form.validateFields();

      if (!reservationId) return;

      setLoading(true);
      await assignRoomNumber(reservationId, roomNumber);
      message.success("Habitación asignada exitosamente");
      form.resetFields();
      setBackendError(null);
      onSuccess();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Error al asignar habitación";
      setBackendError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title="Asignar habitación"
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
      <Form layout="vertical" form={form}>
        <Form.Item
          name="roomNumber"
          label="Número de habitación"
          rules={[{ required: true, message: "Este campo es obligatorio" }]}
        >
          <Input placeholder="Ej. 202-A" />
        </Form.Item>

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
