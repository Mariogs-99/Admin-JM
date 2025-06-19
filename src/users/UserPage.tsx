import { useEffect, useState } from "react";
import { Button, Card, message, Modal, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { User, UserDTO, Role } from "./userInterface";
import {
  GetUsers,
  GetRoles,
  SaveUser,
  UpdateUser,
  DeleteUser,
} from "./userService";
import UserTable from "./UserTable";
import UserFormModal from "./UserFormModal";

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false); // 🟢 nombre cambiado para evitar colisión
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [form] = Form.useForm();

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await GetUsers();
      setUsers(data);
    } catch (error) {
      message.error("Error al cargar usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const roles = await GetRoles();
      setAvailableRoles(roles);
    } catch (error) {
      message.error("Error al cargar roles");
    }
  };

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    setModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalVisible(true);
  };

  const handleDelete = (user: User) => {
    Modal.confirm({
      title: "¿Eliminar usuario?",
      content: `¿Seguro que deseas eliminar a ${user.firstname} ${user.lastname}?`,
      okText: "Sí",
      cancelText: "No",
      okType: "danger",
      onOk: async () => {
        try {
          await DeleteUser(user.userId);
          message.success("Usuario eliminado correctamente");
          loadUsers();
        } catch {
          message.error("Error al eliminar usuario");
        }
      },
    });
  };

  const handleSave = async (data: UserDTO) => {
    try {
      if (editingUser) {
        await UpdateUser(editingUser.userId, data);
        message.success("Usuario actualizado correctamente");
      } else {
        await SaveUser(data);
        message.success("Usuario creado correctamente");
      }
      setModalVisible(false);
      loadUsers();
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message;

      if (backendMessage === "El nombre de usuario ya está en uso") {
        form.setFields([
          {
            name: "username",
            errors: [backendMessage],
          },
        ]);
      } else {
        message.error(backendMessage || "Error al guardar usuario");
      }
    }
  };

  return (
    <Card
      title="Gestión de Usuarios"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Agregar Usuario
        </Button>
      }
      loading={isLoading} // Opcional: muestra spinner en el Card
    >
      <UserTable data={users} onEdit={handleEdit} onDelete={handleDelete} />
      <UserFormModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSave}
        initialData={editingUser}
        form={form}
        availableRoles={availableRoles}
      />
    </Card>
  );
};

export default UserPage;
