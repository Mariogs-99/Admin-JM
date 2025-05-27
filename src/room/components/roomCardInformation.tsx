import { useState } from 'react';
import { Table, Button, Space, Image } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { SortableTitle } from '../../reservation/components/sort/title/sortableTitle';



export const RoomCardInformation = ({
  data,
  onEdit,
  onDelete
}: {
  data: any;
  onEdit: (room: any) => void;
  onDelete: (id: number) => void;
}) => {
  const [sortedInfo, setSortedInfo] = useState<any>({});

  const columns = [
   {
    title: "Imagen",
    key: "image",
    render: (_: any, record: any) => {
      console.log("🧪 Admin imageUrl:", record.imageUrl);
      
      return (
        <Image
          src={record.imageUrl?.startsWith("http") ? record.imageUrl : "/img/default.jpg"}
          width={60}
          height={60}
          alt="Room"
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      );
    },
  },



    {
      title: () => (
        <SortableTitle
          title="Nombre de la Habitación"
          sortedColumn={sortedInfo?.columnKey === "name" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "name",
      key: "name"
    },
    {
      title: () => (
        <SortableTitle
          title="Categoría"
          sortedColumn={sortedInfo?.columnKey === "categoryRoom.nameCategory" ? sortedInfo : undefined}
        />
      ),
      dataIndex: ["categoryRoom", "nameCategory"], // ✅ accede al campo anidado
      key: "categoryRoom.nameCategory",
      render: (nameCategory: string) => nameCategory || "No especificada"
    },
    {
      title: () => (
        <SortableTitle
          title="Precio"
          sortedColumn={sortedInfo?.columnKey === "price" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "price",
      key: "price",
      render: (price: number) => <span style={{ fontWeight: 500 }}>{`$ ${price.toFixed(2)}`}</span>
    },
    {
      title: () => (
        <SortableTitle
          title="Cantidad de Habitaciones"
          sortedColumn={sortedInfo?.columnKey === "quantity" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "quantity",
      key: "quantity"
    },
    {
      title: () => (
        <SortableTitle
          title="Capacidad Máxima"
          sortedColumn={sortedInfo?.columnKey === "maxCapacity" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "maxCapacity",
      key: "maxCapacity"
    },
    {
      title: () => (
        <SortableTitle
          title="Tamaño de Cama"
          sortedColumn={sortedInfo?.columnKey === "sizeBed" ? sortedInfo : undefined}
        />
      ),
      dataIndex: "sizeBed",
      key: "sizeBed"
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} type="default" style={{ borderRadius: 6 }}>
            Editar
          </Button>
          <Button icon={<DeleteOutlined />} onClick={() => onDelete(record.roomId)} type="primary" danger style={{ borderRadius: 6 }}>
            Eliminar
          </Button>
        </Space>
      )
    }
  ];

  const handleChange = (_pagination: any, _filters: any, sorter: any) => {
    setSortedInfo(sorter);
  };

  return (
    <Table
      dataSource={data.map((item: any) => ({ ...item, key: item.roomId }))}
      columns={columns}
      pagination={{ pageSize: 6 }}
      onChange={handleChange}
    />

    
  );
  
};
