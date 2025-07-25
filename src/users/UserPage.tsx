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
import Title from "antd/es/typography/Title";

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

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
    form.resetFields(); // limpiar formulario anterior
    setModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.resetFields(); // limpiar formulario anterior
    setModalVisible(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setConfirmVisible(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await DeleteUser(userToDelete.userId);
      message.success("Usuario eliminado correctamente");
      loadUsers();
    } catch {
      message.error("Error al eliminar usuario");
    } finally {
      setConfirmVisible(false);
      setUserToDelete(null);
    }
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
      form.resetFields();
      loadUsers();
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message;

      if (
        backendMessage?.toLowerCase().includes("usuario") &&
        backendMessage?.toLowerCase().includes("existe")
      ) {
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
    <>
      <Title>Usuarios</Title>
      <Card
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Agregar Usuario
          </Button>
        }
        loading={isLoading}
      >
        <UserTable data={users} onEdit={handleEdit} onDelete={handleDelete} />
        <UserFormModal
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
          }}
          onSubmit={handleSave}
          initialData={editingUser}
          form={form}
          availableRoles={availableRoles}
        />
      </Card>

      {/* Modal de confirmación */}
      <Modal
        open={confirmVisible}
        title="¿Eliminar usuario?"
        onOk={confirmDelete}
        onCancel={() => setConfirmVisible(false)}
        okText="Sí"
        cancelText="No"
        okType="danger"
        centered
        destroyOnClose
      >
        <p>
          ¿Estás seguro que deseas eliminar al usuario{" "}
          <strong>
            {userToDelete?.firstname} {userToDelete?.lastname}
          </strong>
          ?
        </p>
      </Modal>
    </>
  );
};

export default UserPage;
