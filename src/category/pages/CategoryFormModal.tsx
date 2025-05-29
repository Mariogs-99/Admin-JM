import { Modal, Form, Input, InputNumber, Switch, Row, Col, message } from "antd";
import { FC, useEffect } from "react";
import { createCategoryRoom, updateCategoryRoom } from "../services/categoryService";
import { CategoryRoom } from "../../room/interfaces/roomInterface";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  initialData?: CategoryRoom | null;
}

export const CategoryFormModal: FC<Props> = ({
  visible,
  onCancel,
  onSubmit,
  initialData,
}) => {
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
      centered
      width={700}
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="nameCategoryEs"
              label="Nombre en Español"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="nameCategoryEn"
              label="Nombre en Inglés"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="descriptionEs" label="Descripción en Español">
              <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="descriptionEn" label="Descripción en Inglés">
              <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="maxPeople" label="Capacidad Máxima (personas)">
              <InputNumber min={1} max={20} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="bedInfo" label="Información de camas">
              <Input placeholder="Ej. 2 camas Queen" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="roomSize" label="Tamaño de la habitación">
              <Input placeholder="Ej. 25 m²" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="hasTv" label="¿Tiene TV?" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item
              name="hasAc"
              label="¿Tiene aire acondicionado?"
              valuePropName="checked"
              style={{ marginTop: 12 }}
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="hasPrivateBathroom"
              label="¿Tiene baño privado?"
              valuePropName="checked"
              style={{ marginTop: 12 }}
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
