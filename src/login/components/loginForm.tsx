import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { login } from "../services/loginService";
import { LuHotel } from "react-icons/lu"; // Ícono de hotel

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Columna izquierda - Login */}
        <div className="w-full md:w-1/2 p-10">
          <div className="text-center mb-6">
            <LuHotel className="text-[#1e3a8a] text-4xl mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-[#1e3a8a]">Hotel Jardines de las Marias</h2>
            <p className="text-gray-500">Inicio de sesión</p>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center mb-4">{error}</p>
          )}

          <Form layout="vertical" onFinish={onFinish} autoComplete="off">
            <Form.Item
              label="Usuario"
              name="username"
              rules={[{ required: true, message: "Por favor ingresa tu usuario" }]}
            >
              <Input size="large" placeholder="Ej. admin" />
            </Form.Item>

            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{ required: true, message: "Por favor ingresa tu contraseña" }]}
            >
              <Input.Password size="large" placeholder="••••••••" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                block
                style={{ backgroundColor: "#1e3a8a", borderColor: "#1e3a8a" }}
              >
                Iniciar sesión
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Columna derecha - Bienvenida */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white flex-col justify-center items-center p-10">
          <h3 className="text-2xl font-bold mb-4">¡Bienvenido de vuelta!</h3>
          <p className="text-sm leading-relaxed max-w-sm text-center">
            Nos alegra verte nuevamente. Inicia sesión para continuar tu experiencia con nosotros. Esperamos que disfrutes tu estancia en Hotel Jardines.
          </p>
          <p className="text-sm opacity-80 mt-4">
            ¿No tienes cuenta? Contacta con administración.
          </p>
        </div>
      </div>
    </div>
  );
};
