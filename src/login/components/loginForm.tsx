import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, message } from "antd";
import { login } from "../services/loginService";
import logo from "../../assets/jardin.png";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onFinish = async (values: { username: string; password: string }) => {
    setFormError(null);
    setLoading(true);

    try {
      const response = await login(values);
      localStorage.setItem("token", response.token);
      message.success("Inicio de sesión exitoso");
      navigate("/hotel");
    } catch (error: any) {
      const raw = error?.response?.data;
      const backendMessage =
        typeof raw === "object" && raw !== null
          ? raw.message
          : typeof raw === "string"
          ? raw
          : "Error inesperado";

      console.log("📦 Mensaje del backend:", backendMessage);
      console.error("🔴 Error capturado:", error);

      const lowerMessage = backendMessage?.toLowerCase?.() || "";

      if (
        lowerMessage.includes("inactiva") ||
        lowerMessage.includes("user inactive")
      ) {
        setFormError("Tu usuario ha sido desactivado. Contacta con administración.");
      } else if (
        lowerMessage.includes("credenciales") ||
        lowerMessage.includes("invalid credentials")
      ) {
        setFormError("Usuario o contraseña incorrectos.");
      } else if (
        lowerMessage.includes("no encontrado") ||
        lowerMessage.includes("user not found")
      ) {
        setFormError("El usuario no existe.");
      } else {
        setFormError("Error inesperado. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f7f5] flex items-center justify-center px-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden transition-all duration-300">
        
        {/* Izquierda - Login */}
        <div className="p-10 sm:p-16 bg-white">
          <div className="mb-8 text-center">
            <img src={logo} alt="Hotel Logo" className="h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-[#4c341a]">Hotel Jardines de las Marías</h1>
            <p className="text-[#8c6c48] text-sm mt-1">Panel de gestión</p>
          </div>

          {formError && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
              {formError}
            </div>
          )}

          <Form layout="vertical" onFinish={onFinish} size="large">
            <Form.Item
              label={<span className="text-[#5c3a1e] font-medium">Usuario</span>}
              name="username"
              rules={[{ required: true, message: "Por favor ingresa tu usuario" }]}
            >
              <Input placeholder="Ej. admin" className="rounded-md focus:ring-2 focus:ring-[#a8d5ba]" />
            </Form.Item>

            <Form.Item
              label={<span className="text-[#5c3a1e] font-medium">Contraseña</span>}
              name="password"
              rules={[{ required: true, message: "Por favor ingresa tu contraseña" }]}
            >
              <Input.Password placeholder="••••••••" className="rounded-md focus:ring-2 focus:ring-[#a8d5ba]" />
            </Form.Item>

            <Form.Item className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-md font-semibold text-white bg-[#88c9a1] hover:bg-[#76b68c] shadow-md transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Cargando..." : "Iniciar sesión"}
              </button>
            </Form.Item>
          </Form>
        </div>

        {/* Derecha - Bienvenida */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-[#dce8dc] to-[#cbb197] text-white p-12">
          <h2 className="text-3xl font-bold mb-4 text-[#3e2a1a]">Bienvenido de vuelta</h2>
          <p className="text-base text-center text-[#3e2a1a] opacity-90 max-w-md leading-relaxed">
            Inicia sesión para gestionar reservas, habitaciones y más. Gracias
            por formar parte de Jardines de las Marías.
          </p>
          <p className="text-sm mt-6 text-[#3e2a1a] opacity-70">
            ¿Problemas de acceso? Contacta con administración.
          </p>
        </div>
      </div>
    </div>
  );
};
