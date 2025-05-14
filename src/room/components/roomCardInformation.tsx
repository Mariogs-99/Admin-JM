import { useState } from 'react';
import { Table, Button, Space } from 'antd';
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
      title: () => (
        <SortableTitle
          title="Habitación"
          sortedColumn={sortedInfo?.columnKey === "nameEs" ? sortedInfo : undefined}
        />
      ),
      dataIndex: ["nameEs"],
      key: "nameEs",
      render: (text: string) => <span>{text}</span>
    },
    {
      title: () => (
        <SortableTitle
          title="Categoría"
          sortedColumn={sortedInfo?.columnKey === "categoryRoom" ? sortedInfo : undefined}
        />
      ),
      key: "categoryRoom",
      render: (_: any, record: any) => record.categoryRoom?.nameCategoryEs || "No especificada",
    },
    {
      title: () => (
        <SortableTitle
          title="Descripción"
          sortedColumn={sortedInfo?.columnKey === "descriptionEs" ? sortedInfo : undefined}
        />
      ),
      dataIndex: ["descriptionEs"],
      key: "descriptionEs",
    },
    {
      title: () => (
        <SortableTitle
          title="Precio"
          sortedColumn={sortedInfo?.columnKey === "price" ? sortedInfo : undefined}
        />
      ),
      dataIndex: ["price"],
      key: "price",
      render: (price: number) => (
        <span style={{ fontWeight: 500 }}>{`$ ${price.toFixed(2)}`}</span>
      )
    },
    {
      title: () => (
        <SortableTitle
          title="Capacidad Máxima"
          sortedColumn={sortedInfo?.columnKey === "maxCapacity" ? sortedInfo : undefined}
        />
      ),
      dataIndex: ["maxCapacity"],
      key: "maxCapacity",
    },
    {
      title: () => (
        <SortableTitle
          title="Cama"
          sortedColumn={sortedInfo?.columnKey === "sizeBed" ? sortedInfo : undefined}
        />
      ),
      dataIndex: ["sizeBed"],
      key: "sizeBed",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            type="default"
            style={{ borderRadius: 6 }}
          >
            Editar
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.roomId)}
            type="primary"
            danger
            style={{ borderRadius: 6 }}
          >
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
