import { FC, useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
  message,
  Row,
  Col,
  Button,
  Upload,
} from "antd";
import { getAllCategoriesRoom } from "../../category/services/categoryService";
import { SaveRoom,UpdateRoomWithImage } from "../services/roomServices";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

interface RoomFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  initialData?: any;
}

export const RoomFormModal: FC<RoomFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialData,
}) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllCategoriesRoom()
      .then(setCategories)
      .catch(() => message.error("Error al cargar categorías"));
  }, []);

  useEffect(() => {
    if (visible && initialData) {
      const transformed = {
        ...initialData,
        categoryRoomId: initialData?.categoryRoom?.categoryRoomId,
      };
      form.setFieldsValue(transformed);
    }
  }, [initialData, visible]);

 const handleFinish = async (values: any) => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("nameEs", values.nameEs);
    formData.append("nameEn", values.nameEn);
    formData.append("maxCapacity", values.maxCapacity.toString());
    formData.append("price", values.price.toString());
    formData.append("sizeBed", values.sizeBed);
    formData.append("categoryRoomId", values.categoryRoomId.toString());
    formData.append("descriptionEs", values.descriptionEs || "");
    formData.append("descriptionEn", values.descriptionEn || "");

    // Solo agregamos la imagen si fue seleccionada
    if (values.image instanceof File) {
      formData.append("image", values.image);
    }

    if (initialData?.roomId) {
      await UpdateRoomWithImage(initialData.roomId, formData); // ✅ ACTUALIZACIÓN
      message.success("Habitación actualizada correctamente");
    } else {
      await SaveRoom(formData); // ✅ CREACIÓN
      message.success("Habitación creada correctamente");
    }

    form.resetFields();
    onSubmit();
  } catch {
    message.error("Error al guardar la habitación");
  } finally {
    setLoading(false);
  }
};



  const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
  };

  return (
    <Modal
      open={visible}
      title={
        <Title level={4} style={{ margin: 0 }}>
          {initialData ? "Editar habitación" : "Nueva habitación"}
        </Title>
      }
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      centered
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        style={{ marginTop: 16 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="nameEs"
              label="Nombre (ES)"
              style={{ marginBottom: 16 }}
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Input placeholder="Ej. Habitación 101" allowClear style={inputStyle} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="nameEn" label="Nombre (EN)" style={{ marginBottom: 16 }}>
              <Input placeholder="Room 101" allowClear style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="maxCapacity"
              label="Capacidad"
              style={{ marginBottom: 16 }}
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <InputNumber min={1} max={10} style={{ width: "100%", ...inputStyle }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="price"
              label="Precio"
              style={{ marginBottom: 16 }}
              rules={[{ required: true, message: "Campo requerido" }]}
            >
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

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="sizeBed"
              label="Tamaño de cama"
              style={{ marginBottom: 16 }}
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Input placeholder="Ej. 1.5 mt" allowClear style={inputStyle} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="categoryRoomId"
              label="Categoría"
              style={{ marginBottom: 16 }}
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Select
                placeholder="Selecciona categoría"
                allowClear
                style={{ width: "100%", minHeight: 40, borderRadius: 8 }}
              >
                {categories.map((cat) => (
                  <Option key={cat.categoryRoomId} value={cat.categoryRoomId}>
                    {cat.nameCategoryEs}
                  </Option>
                ))}
              </Select>
            </Form.Item>

          </Col>
        </Row>

        <Form.Item name="descriptionEs" label="Descripción (ES)" style={{ marginBottom: 16 }}>
          <Input.TextArea
            rows={3}
            style={{ borderRadius: 8, padding: 10 }}
            placeholder="Descripción en español"
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>

        <Form.Item name="descriptionEn" label="Descripción (EN)" style={{ marginBottom: 24 }}>
          <Input.TextArea
            rows={3}
            style={{ borderRadius: 8, padding: 10 }}
            placeholder="Descripción en inglés (opcional)"
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>

      <Form.Item
          name="image"
          label="Imagen"
          valuePropName="file"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) return e;
            return e?.file?.originFileObj || e?.fileList?.[0]?.originFileObj || null;
          }}
          rules={[{ required: true, message: "La imagen es requerida" }]}
        >
          <Upload
            accept="image/*"
            maxCount={1}
            showUploadList={true}
            beforeUpload={() => false} // Muy importante: evita el upload automático
          >
            <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
          </Upload>
        </Form.Item>



        <Row justify="end" gutter={8}>
          <Col>
            <Button onClick={onCancel} style={{ borderRadius: 6 }}>
              Cancelar
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ borderRadius: 6 }}
            >
              {initialData ? "Actualizar" : "Guardar"}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
