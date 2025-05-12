import { Modal, Form, Input, DatePicker, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

interface ReservationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;
  rooms: any[]; // Lista de habitaciones
}

export const ReservationModal = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  rooms,
}: ReservationModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        ...initialValues,
        initDate: initialValues?.initDate ? dayjs(initialValues.initDate) : undefined,
        finishDate: initialValues?.finishDate ? dayjs(initialValues.finishDate) : undefined,
      });
    }
  }, [initialValues, visible]);

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        onSubmit(values);
        form.resetFields();
      });
  };

  return (
    <Modal
      open={visible}
      title={initialValues ? "Editar Reserva" : "Crear Reserva"}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleOk}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Nombre del huésped" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Teléfono" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="cantPeople" label="Cantidad de personas" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="initDate" label="Fecha de entrada" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="finishDate" label="Fecha de salida" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="categoryRoomId" label="Habitación" rules={[{ required: true }]}>
          <Select placeholder="Seleccione una habitación">
            {rooms.map((room) => (
              <Select.Option key={room.categoryRoomId} value={room.categoryRoomId}>
                {room.nameCategoryEs}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
