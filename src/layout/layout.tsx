import React, { useState } from 'react';
import { ConfigProvider, Layout, Menu, Tooltip, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { IoTodayOutline, IoBedOutline, IoSparklesOutline, IoRestaurantOutline } from "react-icons/io5";
import { BiCalendarEvent } from "react-icons/bi";
import { LuBedSingle } from "react-icons/lu";
import { FaRegBuilding } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { LuHotel } from "react-icons/lu";
import { PiSparkleBold } from "react-icons/pi";
import logo from "../assets/logo.png";
import { PiBuildingThin } from "react-icons/pi";
import { PiBookBookmarkLight, PiBedLight, PiBowlSteamLight, PiCalendarBlankLight, PiChampagneLight } from "react-icons/pi";

const { Content, Footer, Sider } = Layout;

interface MenuItem {
    key: string;
    icon: React.ReactNode;
    label: string;
    url: string;
}

const menuItems: MenuItem[] = [
    { key: '1', icon: <PiBuildingThin size={20} />, label: 'Hotel', url: 'hotel' },
    { key: '2', icon: <PiBookBookmarkLight size={20} />, label: 'Reservaciones', url: 'reservaciones' },
    { key: '3', icon: <PiBedLight size={20} />, label: 'Habitaciones', url: 'habitaciones' },
    { key: '4', icon: <PiBowlSteamLight size={20} />, label: 'Categorias', url: 'categorias' },
    { key: '5', icon: <PiCalendarBlankLight size={20} />, label: 'Eventos', url: 'eventos' },
    { key: '6', icon: <PiChampagneLight size={20} />, label: 'Experiencias', url: 'experiencias' },
    { key: '7', icon: <PiBowlSteamLight size={20} />, label: 'Restaurante', url: 'restaurante' },
];

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const navigate = useNavigate();

    return (
        <ConfigProvider
            theme={{
                components: {
                    Menu: {
                        iconSize: 5
                    },
                },
            }}
        >
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={'15vw'} theme="light">
                    <div className="demo-logo-vertical" />
                    <span className='w-full flex justify-center items-center py-5 pb-10'>
                        <img src={logo} alt="" className='w-[80%]' />
                    </span>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} >
                        {menuItems.map(item => (
                            <Menu.Item
                                key={item.key}
                                icon={<span className='text-[#DFDFDF]'>{item.icon}</span>}
                                onClick={() => navigate(item.url)}
                            >
                                <p className='text-[#DFDFDF] text-[0.9em] font-title'>{item.label}</p>
                            </Menu.Item>
                        ))}
                    </Menu>
                </Sider>
                <Layout>
                    <Content style={{ padding: '3% 5%' }}>
                        <div className='font-title'>
                            <Outlet />
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Hotel Management ©{new Date().getFullYear()}
                    </Footer>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default App;
