import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { login } from "../services/loginService";
import { LuHotel } from "react-icons/lu";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setError(null);
    setLoading(true);
    try {
      const response = await login(values);
      localStorage.setItem("token", response.token);
      navigate("/hotel");
    } catch {
      setError("Usuario o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Sección izquierda - Login */}
        <div className="p-12 sm:p-16 bg-white">
          <div className="mb-8 text-center">
            <LuHotel className="text-5xl text-[#5c3a1e] mx-auto mb-3" />
            <h1 className="text-3xl font-semibold text-[#5c3a1e]">
              Hotel Jardines de las Marías
            </h1>
            <p className="text-[#a58e76] text-base mt-1">Panel de gestión</p>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center mb-4">{error}</p>
          )}

          <Form layout="vertical" onFinish={onFinish} size="large">
            <Form.Item
              label={<span className="text-[#5c3a1e]">Usuario</span>}
              name="username"
              rules={[{ required: true, message: "Por favor ingresa tu usuario" }]}
            >
              <Input placeholder="Ej. admin" />
            </Form.Item>

            <Form.Item
              label={<span className="text-[#5c3a1e]">Contraseña</span>}
              name="password"
              rules={[{ required: true, message: "Por favor ingresa tu contraseña" }]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>

            <Form.Item className="mt-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="bg-[#b49a7b] hover:bg-[#a67c52] border-none text-white"
              >
                Iniciar sesión
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Sección derecha - Bienvenida */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-[#d3bfa5] to-[#b49a7b] text-white p-12">
          <h2 className="text-3xl font-bold mb-4 text-[#4e301a]">Bienvenido de vuelta</h2>
          <p className="text-base text-center text-[#3e2a1a] opacity-90 max-w-md leading-relaxed">
            Inicia sesión para gestionar reservas, habitaciones y más. Gracias por formar parte de Jardines de las Marías.
          </p>
          <p className="text-sm mt-6 text-[#3e2a1a] opacity-70">
            ¿Problemas de acceso? Contacta con administración.
          </p>
        </div>
      </div>
    </div>
  );
};
