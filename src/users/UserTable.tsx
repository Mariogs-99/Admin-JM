import { FC } from "react";
import { Table, Space, Button, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { User } from "./userInterface";

interface Props {
  data: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserTable: FC<Props> = ({ data, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Nombre",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Apellido",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Usuario",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Correo",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Teléfono",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Estado",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Activo" : "Inactivo"}
        </Tag>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: User) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Editar
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => onDelete(record)}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="userId"
      pagination={{ pageSize: 8 }}
    />
  );
};

export default UserTable;
