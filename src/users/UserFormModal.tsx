import { FC, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  FormInstance,
} from "antd";
import { User, UserDTO, Role } from "./userInterface";

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: UserDTO) => void;
  initialData?: User | null;
  form: FormInstance;
  availableRoles: Role[];  // Role[]
}

const UserFormModal: FC<Props> = ({
  visible,
  onCancel,
  onSubmit,
  initialData,
  form,
  availableRoles,
}) => {
  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          password: "", // para no sobreescribir
          role: initialData.role || undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialData, form]);

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <Modal
      title={initialData ? "Editar Usuario" : "Agregar Usuario"}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Guardar"
      cancelText="Cancelar"
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="firstname"
              label="Nombre"
              rules={[{ required: true, message: "El nombre es obligatorio" }]}
            >
              <Input placeholder="Nombre" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastname"
              label="Apellido"
              rules={[{ required: true, message: "El apellido es obligatorio" }]}
            >
              <Input placeholder="Apellido" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="email" label="Correo">
          <Input placeholder="Correo electrónico" />
        </Form.Item>

        <Form.Item name="phone" label="Teléfono">
          <Input placeholder="Teléfono" />
        </Form.Item>

        <Form.Item
          name="username"
          label="Usuario"
          rules={[{ required: true, message: "El usuario es obligatorio" }]}
        >
          <Input placeholder="Nombre de usuario" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Contraseña"
          rules={
            initialData
              ? []
              : [{ required: true, message: "La contraseña es obligatoria" }]
          }
        >
          <Input.Password placeholder="Contraseña" />
        </Form.Item>

        <Form.Item
          name="active"
          label="Estado"
          rules={[{ required: true, message: "Seleccione el estado" }]}
        >
          <Select placeholder="Seleccione el estado">
            <Option value={true}>Activo</Option>
            <Option value={false}>Inactivo</Option>
          </Select>
        </Form.Item>

        {/* Selector de roles */}
        <Form.Item
          name="role"
          label="Rol"
          rules={[{ required: true, message: "Seleccione un rol" }]}
        >
          <Select placeholder="Seleccione un rol" allowClear>
            {availableRoles.map((role) => (
              <Option key={role.id} value={role.name}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserFormModal;
