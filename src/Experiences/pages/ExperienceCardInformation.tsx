import { Table, Button, Space, Image, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Experience } from "../interfaces/Experience";

const BASE_IMAGE_URL = `${import.meta.env.VITE_BASE_URL}/uploads/`;

export const ExperienceCardInformation = ({
  data,
  onEdit,
  onDelete,
}: {
  data: Experience[];
  onEdit: (experience: Experience) => void;
  onDelete: (experience: Experience) => void;
}) => {
  const columns = [
    {
      title: "Imagen",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl: string) => (
        <Image
          width={80}
          height={50}
          src={`${BASE_IMAGE_URL}${imageUrl}`}
          alt="Imagen"
          style={{ objectFit: "cover", borderRadius: 6 }}
        />
      ),
    },
    {
      title: "Título (ES / EN)",
      key: "title",
      render: (_: any, record: Experience) => (
        <>
          <strong>{record.titleEs}</strong>
          <br />
          <span className="text-gray-500 text-sm italic">{record.titleEn}</span>
        </>
      ),
    },
    {
      title: "Duración",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Capacidad",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
      render: (price: number) =>
        `$ ${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
    },
    {
      title: "Estado",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) =>
        active ? (
          <Tag color="green">Activo</Tag>
        ) : (
          <Tag color="red">Inactivo</Tag>
        ),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Experience) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            style={{ borderRadius: 6 }}
          >
            Editar
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record)}
            style={{ borderRadius: 6 }}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="experienceId"
      dataSource={data}
      columns={columns}
      pagination={{ pageSize: 6 }}
    />
  );
};
