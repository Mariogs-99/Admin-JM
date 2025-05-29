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
  Typography,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { SaveEvent, UpdateEventWithImage } from "../services/eventServices";

const { Title } = Typography;
const { Option } = Select;

interface EventFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData?: any;
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
      form.setFieldsValue({ active: true });
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

  const inputStyle = { height: 36, borderRadius: 6, paddingInline: 10 };

  return (
    <Modal
      title={
        <Title level={5} style={{ margin: 0 }}>
          {initialData ? "Editar evento" : "Agregar nuevo evento"}
        </Title>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit} style={{ marginTop: 8 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="title" label="Título" rules={[{ required: true }]}>
              <Input placeholder="Nombre del evento" style={inputStyle} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="eventDate" label="Fecha del evento" rules={[{ required: true }]}>
              <DatePicker format="YYYY-MM-DD" style={{ width: "100%", ...inputStyle }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="capacity" label="Capacidad" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: "100%", ...inputStyle }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="price" label="Precio ($)" rules={[{ required: true }]}>
              <InputNumber
                min={0}
                step={0.01}
                style={{ width: "100%", ...inputStyle }}
                formatter={(value) => `$ ${value}`}
                parser={((value?: string) => (value ? value.replace(/[^\d.]/g, "") : "")) as any}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Descripción" rules={[{ required: true }]}>
          <Input.TextArea
            placeholder="Breve descripción"
            style={{ borderRadius: 6, padding: 10 }}
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="active" label="Estado" rules={[{ required: true }]}>
              <Select style={inputStyle}>
                <Option value={true}>Activo</Option>
                <Option value={false}>Inactivo</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="image"
              label="Imagen del evento"
              valuePropName="file"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) return e;
                return e?.file?.originFileObj || e?.fileList?.[0]?.originFileObj || null;
              }}
              rules={!initialData ? [{ required: true, message: "La imagen es requerida" }] : []}
            >
              <Upload accept="image/*" maxCount={1} showUploadList beforeUpload={() => false}>
                <Button icon={<UploadOutlined />} size="middle">
                  Seleccionar imagen
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={onClose} style={{ borderRadius: 6 }}>
            Cancelar
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ borderRadius: 6 }}
          >
            {initialData ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
