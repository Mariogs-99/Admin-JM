import { FC } from "react";
import { Table, Space, Button, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { OtaIcalConfig } from "./otaInterface";

interface Props {
  data: OtaIcalConfig[];
  onEdit: (ota: OtaIcalConfig) => void;
}

const OtaTable: FC<Props> = ({ data, onEdit }) => {
  const columns = [
    {
      title: "Integración",
      dataIndex: "otaName",
      key: "otaName",
    },
    {
      title: "URL iCal",
      dataIndex: "icalUrl",
      key: "icalUrl",
      render: (url: string) => url ? url : <Tag color="red">No configurado</Tag>,
    },
    {
      title: "Estado",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Activa" : "Inactiva"}
        </Tag>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: OtaIcalConfig) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Configurar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={false}
    />
  );
};

export default OtaTable;
