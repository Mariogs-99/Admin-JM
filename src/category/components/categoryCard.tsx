import { FC } from "react"
import { DeleteOutlined, DownOutlined, EditOutlined, MoreOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: 'Editar',
    icon: <EditOutlined/>,
  },
  {
    key: '2',
    label: 'Editar',
    icon: <DeleteOutlined />,
  },
];

interface CategoryCardInterface {
    category: string,
    description: string
}

export const CategoryCard: FC<CategoryCardInterface> = ({ category, description }) => {
    return (
        <article className="flex flex-col px-10 py-7 shadow-sm rounded-sm border border-border gap-5">
            <span className="flex justify-between">
                <h3 className="text-xl font-semibold">{category}</h3>
                <span>
                <Dropdown menu={{ items }}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            
                            <MoreOutlined className="rotate-90" />
                        </Space>
                    </a>
                </Dropdown>
            </span>
            </span>
            <h3>{description}</h3>

           
        </article>
    )
}