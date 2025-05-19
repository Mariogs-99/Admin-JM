import { FC, useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Upload,
  Button,
  message,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { SaveEvent, UpdateEventWithImage } from "../services/eventServices";

interface EventFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData?: any; // para modo edición
}

export const EventFormModal: FC<EventFormModalProps> = ({
  visible,
  onClose,
  onSaved,
  initialData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && initialData) {
      form.setFieldsValue({
        ...initialData,
        eventDate: dayjs(initialData.eventDate),
        active: initialData.active ?? true,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ active: true }); // valor por defecto
    }
  }, [visible, initialData]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("eventDate", values.eventDate.format("YYYY-MM-DD"));
      formData.append("capacity", values.capacity.toString());
      formData.append("price", values.price.toString());
      formData.append("active", values.active.toString());

      const file = values.image;
      if (file instanceof File) {
        formData.append("image", file);
      } else if (!initialData?.id) {
        message.warning("La imagen es requerida.");
        return;
      }

      setLoading(true);

      if (initialData?.id) {
        await UpdateEventWithImage(initialData.id, formData);
        message.success("Evento actualizado con éxito");
      } else {
        await SaveEvent(formData);
        message.success("Evento creado con éxito");
      }

      form.resetFields();
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error al guardar evento:", error);
      message.error("Error al guardar evento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={initialData ? "Editar evento" : "Agregar nuevo evento"}
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={initialData ? "Actualizar" : "Guardar"}
      cancelText="Cancelar"
    >
      <Form layout="vertical" form={form}>
        <Form.Item name="title" label="Título" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Descripción" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="eventDate" label="Fecha del evento" rules={[{ required: true }]}>
          <DatePicker format="YYYY-MM-DD" className="w-full" />
        </Form.Item>

        <Form.Item name="capacity" label="Capacidad" rules={[{ required: true }]}>
          <InputNumber min={1} className="w-full" />
        </Form.Item>

        <Form.Item name="price" label="Precio ($)" rules={[{ required: true }]}>
          <InputNumber min={0} step={0.01} className="w-full" />
        </Form.Item>

        <Form.Item name="active" label="Estado" rules={[{ required: true }]}>
          <Select>
            <Select.Option value={true}>Activo</Select.Option>
            <Select.Option value={false}>Inactivo</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="image"
          label="Imagen del evento"
          valuePropName="file"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) return e;
            return e?.file?.originFileObj || e?.fileList?.[0]?.originFileObj || null;
          }}
          rules={
            !initialData
              ? [{ required: true, message: "La imagen es requerida" }]
              : []
          }
        >
          <Upload
            accept="image/*"
            maxCount={1}
            showUploadList={true}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Seleccionar imagen</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
