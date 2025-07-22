import React, { useEffect, useState } from 'react';
import { ConfigProvider, Layout, Menu, Badge } from 'antd';
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
import { BellOutlined } from '@ant-design/icons';
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import { logout } from '../login/services/loginService';
import { getAuthenticatedUser } from '../users/userService';

const { Content, Footer, Sider, Header } = Layout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  url?: string;
}

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [lastNotification, setLastNotification] = useState<any>(null);
  const navigate = useNavigate();

  const role = (localStorage.getItem("role") || "").toUpperCase();

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

  // 🧩 WebSocket para notificaciones globales
  useEffect(() => {
    const socket = new SockJS(import.meta.env.VITE_WS_URL || "http://localhost:8080/ws-reservations");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe("/topic/reservations", (message) => {
          const data = JSON.parse(message.body);
          setNotificationCount((prev) => prev + 1);
          setLastNotification(data);

          Swal.fire({
            title: "Nueva reservación",
            html: `Nombre: <b>${data.name}</b><br/>Código: <b>${data.reservationCode}</b><br/>Habitación: <b>${data.roomSummary}</b>`,
            icon: "info",
            toast: true,
            position: "top-end",
            timer: 10000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        });
      },
      onStompError: (frame) => {
        console.error("Error STOMP", frame);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  const menuItems: MenuItem[] = [
    { key: '1', icon: <PiBuildingThin size={20} />, label: 'Hotel', url: 'hotel' },
    { key: '2', icon: <PiBookBookmarkLight size={20} />, label: 'Reservaciones', url: 'reservaciones' },
    { key: '3', icon: <PiBedLight size={20} />, label: 'Habitaciones', url: 'habitaciones' },
    { key: '4', icon: <PiBowlSteamLight size={20} />, label: 'Categorias', url: 'categorias' },
    { key: '5', icon: <PiCalendarBlankLight size={20} />, label: 'Eventos', url: 'eventos' },
    { key: '6', icon: <PiChampagneLight size={20} />, label: 'Experiencias', url: 'experiencias' },
    { key: '7', icon: <PiBowlSteamLight size={20} />, label: 'Restaurante', url: 'restaurante' },
  ];

  if (role === "ADMIN") {
    menuItems.push({
      key: '8',
      icon: <PiUsersThreeLight size={20} />,
      label: 'Usuarios',
      url: 'usuarios',
    });

    menuItems.push({
      key: '9',
      icon: <PiCalendarBlankLight size={20} />,
      label: 'Integraciones OTA',
      url: 'ota-integraciones',
    });

    menuItems.push({
      key: '10',
      icon: <PiBuildingThin size={20} />,
      label: 'Configuración',
      url: 'configuracion',
    });

  }

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
          <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: 64 }}>
            <Badge count={notificationCount} overflowCount={99} size="default" offset={[-2, 2]}>
              <BellOutlined
                style={{
                  fontSize: 30,
                  cursor: "pointer",
                  color: "#555",
                  transition: "transform 0.2s",
                }}
                onClick={() => {
                  if (lastNotification) {
                    Swal.fire({
                      title: "Última reservación",
                      html: `Nombre: <b>${lastNotification.name}</b><br/>Código: <b>${lastNotification.reservationCode}</b><br/>Habitación: <b>${lastNotification.roomSummary}</b>`,
                      icon: "info",
                      confirmButtonText: "Cerrar"
                    });
                    setNotificationCount(0);
                  }
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </Badge>
          </Header>

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
