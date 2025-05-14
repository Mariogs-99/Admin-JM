import { FC } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  TeamOutlined,
  InteractionOutlined,
  ExpandOutlined,
  DesktopOutlined,
  CloudOutlined,
  SkinOutlined,
} from "@ant-design/icons";
import { Dropdown, Space, MenuProps } from "antd";

interface CategoryCardInterface {
  category: string;
  description: string;
  maxPeople?: number;
  bedInfo?: string;
  roomSize?: string;
  hasTv?: boolean;
  hasAc?: boolean;
  hasPrivateBathroom?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const CategoryCard: FC<CategoryCardInterface> = ({
  category,
  description,
  maxPeople,
  bedInfo,
  roomSize,
  hasTv,
  hasAc,
  hasPrivateBathroom,
  onEdit,
  onDelete,
}) => {
  const items: MenuProps["items"] = [
    {
      key: "edit",
      label: "Editar",
      icon: <EditOutlined />,
      onClick: onEdit,
    },
    {
      key: "delete",
      label: "Eliminar",
      icon: <DeleteOutlined />,
      onClick: onDelete,
    },
  ];

  return (
    <article className="flex flex-col px-10 py-7 shadow-sm rounded-sm border border-border gap-4">
      <span className="flex justify-between">
        <h3 className="text-2xl font-semibold">{category}</h3>
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <MoreOutlined className="rotate-90 text-lg" />
            </Space>
          </a>
        </Dropdown>
      </span>
      <p className="text-base text-gray-700">{description}</p>

      {(maxPeople || bedInfo || roomSize || hasTv || hasAc || hasPrivateBathroom) && (
        <ul className="text-base text-gray-700 space-y-2 mt-2">
          {maxPeople && (
            <li className="flex items-center">
              <TeamOutlined className="mr-2 text-[18px] text-purple-600" />
              Hasta {maxPeople} personas
            </li>
          )}
          {bedInfo && (
            <li className="flex items-center">
              <InteractionOutlined className="mr-2 text-[18px] text-purple-600" />
              {bedInfo}
            </li>
          )}
          {roomSize && (
            <li className="flex items-center">
              <ExpandOutlined className="mr-2 text-[18px] text-purple-600" />
              {roomSize}
            </li>
          )}
          {hasTv && (
            <li className="flex items-center">
              <DesktopOutlined className="mr-2 text-[18px] text-purple-600" />
              Smart TV
            </li>
          )}
          {hasAc && (
            <li className="flex items-center">
              <CloudOutlined className="mr-2 text-[18px] text-purple-600" />
              Aire acondicionado
            </li>
          )}
          {hasPrivateBathroom && (
            <li className="flex items-center">
              <SkinOutlined className="mr-2 text-[18px] text-purple-600" />
              Baño privado
            </li>
          )}
        </ul>
      )}
    </article>
  );
};
