import { useState } from 'react';
import { Table, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { SortableTitle } from '../../reservation/components/sort/title/sortableTitle';
import { EventDTO } from '../services/eventServices';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

export const EventCardInformation = ({
  data,
  onEdit,
  onDelete,
}: {
  data: EventDTO[];
  onEdit: (event: EventDTO) => void;
  onDelete: (event: EventDTO) => void; // ✅ ahora recibe el evento completo
}) => {
  const [sortedInfo, setSortedInfo] = useState<any>({});

  const columns = [
    {
      title: () => (
        <SortableTitle
          title="Evento"
          sortedColumn={sortedInfo?.columnKey === 'title' ? sortedInfo : undefined}
        />
      ),
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: () => (
        <SortableTitle
          title="Descripción"
          sortedColumn={sortedInfo?.columnKey === 'description' ? sortedInfo : undefined}
        />
      ),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: () => (
        <SortableTitle
          title="Fecha"
          sortedColumn={sortedInfo?.columnKey === 'eventDate' ? sortedInfo : undefined}
        />
      ),
      dataIndex: 'eventDate',
      key: 'eventDate',
      render: (date: string) => dayjs(date).format("D [de] MMMM [de] YYYY"),
    },
    {
      title: () => (
        <SortableTitle
          title="Capacidad"
          sortedColumn={sortedInfo?.columnKey === 'capacity' ? sortedInfo : undefined}
        />
      ),
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: () => (
        <SortableTitle
          title="Precio"
          sortedColumn={sortedInfo?.columnKey === 'price' ? sortedInfo : undefined}
        />
      ),
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <span style={{ fontWeight: 500 }}>{`$ ${price.toFixed(2)}`}</span>
      ),
    },
    {
      title: () => (
        <SortableTitle
          title="Estado"
          sortedColumn={sortedInfo?.columnKey === 'active' ? sortedInfo : undefined}
        />
      ),
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <span className={`font-semibold ${active ? 'text-green-600' : 'text-red-500'}`}>
          {active ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: EventDTO) => (
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
            onClick={() => onDelete(record)} // ✅ pasa el evento completo
            type="primary"
            danger
            style={{ borderRadius: 6 }}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  const handleChange = (_pagination: any, _filters: any, sorter: any) => {
    setSortedInfo(sorter);
  };

  return (
    <Table
      dataSource={data.map((item) => ({ ...item, key: item.id }))}
      columns={columns}
      pagination={{ pageSize: 6 }}
      onChange={handleChange}
    />
  );
};
