import { Modal, Form, Input, InputNumber, Switch, message } from "antd";
import { FC, useEffect } from "react";
import { createCategoryRoom, updateCategoryRoom } from "../services/categoryService";
import { CategoryRoom } from "../../room/interfaces/roomInterface";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  initialData?: CategoryRoom | null;
}

export const CategoryFormModal: FC<Props> = ({ visible, onCancel, onSubmit, initialData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (initialData) {
        await updateCategoryRoom(initialData.categoryRoomId, values);
        message.success("Categoría actualizada");
      } else {
        await createCategoryRoom(values);
        message.success("Categoría creada");
      }
      onCancel();
      onSubmit();
    } catch {
      message.error("Error al guardar la categoría");
    }
  };

  return (
    <Modal
      title={initialData ? "Editar Categoría" : "Agregar Categoría"}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <Form layout="vertical" form={form}>
        <Form.Item name="nameCategoryEs" label="Nombre en Español" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="nameCategoryEn" label="Nombre en Inglés" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="descriptionEs" label="Descripción en Español">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="descriptionEn" label="Descripción en Inglés">
          <Input.TextArea />
        </Form.Item>

        {/* Nuevos campos */}
        <Form.Item name="maxPeople" label="Capacidad Máxima (personas)">
          <InputNumber min={1} max={20} />
        </Form.Item>
        <Form.Item name="bedInfo" label="Información de camas">
          <Input placeholder="Ej. 2 camas Queen" />
        </Form.Item>
        <Form.Item name="roomSize" label="Tamaño de la habitación">
          <Input placeholder="Ej. 25 m²" />
        </Form.Item>
        <Form.Item name="hasTv" label="¿Tiene TV?" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="hasAc" label="¿Tiene aire acondicionado?" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="hasPrivateBathroom" label="¿Tiene baño privado?" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
