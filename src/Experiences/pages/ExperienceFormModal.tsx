import {
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  message,
  Image,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Experience } from "../interfaces/Experience";
import {
  createExperience,
  updateExperience,
  uploadImage,
} from "../services/experiencesServices";

interface ExperienceFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  initialData?: Experience | null;
}

const ExperienceFormModal: React.FC<ExperienceFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialData,
}) => {
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState<string>("");

  const baseImageUrl = `${import.meta.env.VITE_BASE_URL}/uploads/`;

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
      if (initialData.imageUrl) {
        setImagePreview(`${baseImageUrl}${initialData.imageUrl}`);
      }
    } else {
      form.resetFields();
      setImagePreview("");
    }
  }, [initialData, form]);

  const handleFinish = async (values: Experience) => {
    try {
      if (initialData?.experienceId) {
        await updateExperience(initialData.experienceId, values);
        message.success("Experiencia actualizada exitosamente");
      } else {
        await createExperience(values);
        message.success("Experiencia creada exitosamente");
      }
      form.resetFields();
      setImagePreview("");
      onSubmit();
    } catch (error) {
      message.error("Hubo un error al guardar la experiencia");
    }
  };

  const handleImageUpload = async ({ file }: any) => {
    try {
      const fileName = await uploadImage(file);
      form.setFieldValue("imageUrl", fileName);
      setImagePreview(`${baseImageUrl}${fileName}`);
      message.success("Imagen subida exitosamente");
    } catch (error) {
      console.error("Error al subir imagen:", error);
      message.error("Error al subir la imagen");
    }
  };

  return (
    <Modal
      open={visible}
      title={initialData ? "Editar Experiencia" : "Agregar Experiencia"}
      onCancel={() => {
        onCancel();
        form.resetFields();
        setImagePreview("");
      }}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Guardar
        </Button>,
      ]}
      width={600}
      centered
      bodyStyle={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "12px" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ maxHeight: "100%", overflowY: "auto" }}
      >
        <Form.Item
          label="Título"
          name="title"
          rules={[{ required: true, message: "El título es requerido" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="description"
          rules={[{ required: true, message: "La descripción es requerida" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Duración" name="duration">
          <Input placeholder="Ej: 2 horas" />
        </Form.Item>

        <Form.Item label="Capacidad" name="capacity">
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Precio ($)" name="price">
          <InputNumber
            min={0}
            step={0.01}
            style={{ width: "100%" }}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
          />
        </Form.Item>

        <Form.Item label="Días disponibles" name="availableDays">
          <Input placeholder="Ej: Lunes a Sábado" />
        </Form.Item>

        <Form.Item name="imageUrl" hidden>
          <Input />
        </Form.Item>

        <Form.Item label="Imagen">
          <Upload
            name="file"
            accept="image/*"
            showUploadList={false}
            customRequest={handleImageUpload}
          >
            <Button icon={<UploadOutlined />}>Subir imagen</Button>
          </Upload>
        </Form.Item>

        {imagePreview && (
          <Form.Item>
            <Image
              src={imagePreview}
              alt="Vista previa"
              width="100%"
              style={{ borderRadius: "10px", objectFit: "cover" }}
            />
          </Form.Item>
        )}

        <Form.Item label="Activo" name="active" valuePropName="checked">
          <Switch defaultChecked />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExperienceFormModal;
