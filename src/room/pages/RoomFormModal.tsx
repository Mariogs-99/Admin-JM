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
import { SaveRoom, UpdateRoomWithImage } from "../services/roomServices";
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
        nameEs: initialData.nameEs,
        nameEn: initialData.nameEn,
        descriptionEs: initialData.descriptionEs,
        descriptionEn: initialData.descriptionEn,
        categoryRoomId:
          initialData.categoryRoom?.categoryRoomId ?? initialData.categoryRoomId,
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
      formData.append("descriptionEs", values.descriptionEs || "");
      formData.append("descriptionEn", values.descriptionEn || "");
      formData.append("maxCapacity", values.maxCapacity.toString());
      formData.append("price", values.price.toString());
      formData.append("sizeBed", values.sizeBed);
      formData.append("quantity", values.quantity.toString());
      formData.append("categoryRoomId", values.categoryRoomId.toString());

      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      if (initialData?.roomId) {
        await UpdateRoomWithImage(initialData.roomId, formData);
        message.success("Habitación actualizada correctamente");
      } else {
        await SaveRoom(formData);
        message.success("Habitación creada correctamente");
      }

      form.resetFields();
      onSubmit();
    } catch (error) {
      message.error("Error al guardar la habitación");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    height: 36,
    borderRadius: 6,
    paddingInline: 10,
  };

  return (
    <Modal
      open={visible}
      title={
        <Title level={5} style={{ margin: 0 }}>
          {initialData ? "Editar habitación" : "Nueva habitación"}
        </Title>
      }
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      centered
      width={640}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish} style={{ marginTop: 8 }}>
        <Row gutter={[12, 8]}>
          <Col span={12}>
            <Form.Item name="nameEs" label="Nombre (ES)" rules={[{ required: true }]}>
              <Input placeholder="Ej. Habitación Familiar" style={inputStyle} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="nameEn" label="Nombre (EN)" rules={[{ required: true }]}>
              <Input placeholder="e.g. Family Room" style={inputStyle} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="quantity" label="Cantidad de cuartos disponibles" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: "100%", ...inputStyle }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="maxCapacity" label="Capacidad máxima" rules={[{ required: true }]}>
              <InputNumber min={1} max={10} style={{ width: "100%", ...inputStyle }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="price" label="Precio por noche" rules={[{ required: true }]}>
              <InputNumber
                min={0}
                step={0.01}
                style={{ width: "100%", ...inputStyle }}
                formatter={(value) => `$ ${value}`}
                parser={((value?: string) => (value ? value.replace(/[^\d.]/g, "") : "")) as any}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="sizeBed" label="Tamaño de cama" rules={[{ required: true }]}>
              <Input placeholder="Ej. Queen" style={inputStyle} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="categoryRoomId" label="Categoría" rules={[{ required: true }]}>
              <Select placeholder="Selecciona una categoría" style={{ ...inputStyle, width: "100%" }}>
                {categories.map((cat) => (
                  <Option key={cat.categoryRoomId} value={cat.categoryRoomId}>
                    {cat.nameCategoryEs}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="descriptionEs" label="Descripción (ES)">
          <Input.TextArea
            placeholder="Descripción breve en español"
            style={{ borderRadius: 6, padding: 10 }}
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>

        <Form.Item name="descriptionEn" label="Descripción (EN)">
          <Input.TextArea
            placeholder="Brief description in English"
            style={{ borderRadius: 6, padding: 10 }}
            autoSize={{ minRows: 2, maxRows: 4 }}
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
          rules={[{ required: !initialData, message: "La imagen es requerida" }]}
        >
          <Upload accept="image/*" maxCount={1} showUploadList beforeUpload={() => false}>
            <Button icon={<UploadOutlined />} size="middle">
              Seleccionar imagen
            </Button>
          </Upload>
        </Form.Item>

        <Row justify="end" style={{ marginTop: 8 }}>
          <Button onClick={onCancel} style={{ marginRight: 8, borderRadius: 6 }}>
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} style={{ borderRadius: 6 }}>
            {initialData ? "Actualizar" : "Guardar"}
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};
