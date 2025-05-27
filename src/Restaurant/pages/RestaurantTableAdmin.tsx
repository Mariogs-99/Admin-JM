import { useState, useEffect } from "react";
import { Table, Button, Space, Image, Tag, message, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Restaurant } from "../interfaces/restaurantInterface";
import { GetRestaurants, DeleteRestaurant } from "../services/restaurantService";
import { SortableTitle } from "../../reservation/components/sort/title/sortableTitle";

interface RestaurantTableAdminProps {
  onEdit: (restaurant: Restaurant) => void;
  refresh?: boolean;
}

export const RestaurantTableAdmin = ({ onEdit, refresh }: RestaurantTableAdminProps) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortedInfo, setSortedInfo] = useState<any>({});

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const data = await GetRestaurants();
      setRestaurants(data);
    } catch (err) {
      message.error("Error al cargar restaurantes");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRestaurants();
  }, [refresh]); // ✅ recarga cuando cambia la prop refresh

  const handleDelete = async (id: number) => {
    try {
      await DeleteRestaurant(id);
      message.success("Restaurante eliminado correctamente");
      fetchRestaurants();
    } catch (err) {
      message.error("Error al eliminar restaurante");
    }
  };

  const columns = [
    {
      title: "Imagen",
      key: "imgUrl",
      render: (_: any, record: Restaurant) => (
        <Image
          src={
            record.imgUrl?.startsWith("http")
              ? record.imgUrl
              : import.meta.env.VITE_BASE_URL + record.imgUrl
          }
          width={60}
          height={60}
          alt="Imagen restaurante"
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      ),
    },
    {
      title: () => (
        <SortableTitle
          title="Nombre"
          sortedColumn={sortedInfo?.columnKey === "name" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "name",
      key: "name",
    },
    {
      title: () => (
        <SortableTitle
          title="Horario"
          sortedColumn={sortedInfo?.columnKey === "schedule" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "schedule",
      key: "schedule",
    },
    {
      title: () => (
        <SortableTitle
          title="Destacado"
          sortedColumn={sortedInfo?.columnKey === "highlighted" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "highlighted",
      key: "highlighted",
      render: (highlighted: boolean) =>
        highlighted ? <Tag color="green">Sí</Tag> : <Tag color="red">No</Tag>,
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Restaurant) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            type="default"
            style={{ borderRadius: 6 }}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de eliminar este restaurante?"
            onConfirm={() => handleDelete(record.restaurantId)}
            okText="Sí"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              type="primary"
              style={{ borderRadius: 6 }}
            >
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleChange = (_pagination: any, _filters: any, sorter: any) => {
    setSortedInfo(sorter);
  };

  return (
    <Table
      dataSource={restaurants.map((r) => ({ ...r, key: r.restaurantId }))}
      columns={columns}
      pagination={{ pageSize: 6 }}
      onChange={handleChange}
      loading={loading}
    />
  );
};
