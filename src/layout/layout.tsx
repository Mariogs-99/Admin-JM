import React, { useEffect, useState } from 'react';
import { ConfigProvider, Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  PiBuildingThin,
  PiBookBookmarkLight,
  PiBedLight,
  PiBowlSteamLight,
  PiCalendarBlankLight,
  PiChampagneLight,
  PiSignOutBold,
  PiUsersThreeLight,
} from "react-icons/pi";
import logo from "../assets/logo.png";
import { logout } from '../login/services/loginService';
import { getAuthenticatedUser } from '../users/userService'; // Ajusta si es necesario

const { Content, Footer, Sider } = Layout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  url?: string;
}

const menuItems: MenuItem[] = [
  { key: '1', icon: <PiBuildingThin size={20} />, label: 'Hotel', url: 'hotel' },
  { key: '2', icon: <PiBookBookmarkLight size={20} />, label: 'Reservaciones', url: 'reservaciones' },
  { key: '3', icon: <PiBedLight size={20} />, label: 'Habitaciones', url: 'habitaciones' },
  { key: '4', icon: <PiBowlSteamLight size={20} />, label: 'Categorias', url: 'categorias' },
  { key: '5', icon: <PiCalendarBlankLight size={20} />, label: 'Eventos', url: 'eventos' },
  { key: '6', icon: <PiChampagneLight size={20} />, label: 'Experiencias', url: 'experiencias' },
  { key: '7', icon: <PiBowlSteamLight size={20} />, label: 'Restaurante', url: 'restaurante' },
  { key: '8', icon: <PiUsersThreeLight size={20} />, label: 'Usuarios', url: 'usuarios' },
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getAuthenticatedUser();
        setAuthUser(`${user.firstname} ${user.lastname}`);
      } catch (error) {
        console.error("No se pudo obtener el usuario autenticado");
      }
    };
    loadUser();
  }, []);

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
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={'15vw'} theme="dark">
          <div className="w-full flex flex-col items-center pt-6 pb-4 px-3">
            <img src={logo} alt="logo" className="w-[80%] mb-3" />
            {authUser && (
              <div className="text-center w-full">
                <p className="text-[#DFDFDF] text-sm font-light leading-tight">
                  Bienvenido/a
                </p>
                <p className="text-white text-sm font-medium truncate">
                  {authUser}
                </p>
              </div>
            )}
          </div>

          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            {menuItems.map(item => (
              <Menu.Item
                key={item.key}
                icon={<span className='text-[#DFDFDF]'>{item.icon}</span>}
                onClick={() => item.url && navigate(item.url)}
              >
                <p className='text-[#DFDFDF] text-[0.9em] font-title'>{item.label}</p>
              </Menu.Item>
            ))}
            <Menu.Item
              key="logout"
              icon={<span className="text-red-400"><PiSignOutBold size={20} /></span>}
              onClick={handleLogout}
            >
              <p className="text-red-400 text-[0.9em] font-title">Cerrar sesión</p>
            </Menu.Item>
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
