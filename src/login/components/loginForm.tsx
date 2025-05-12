import { useState } from "react";
import Input from "../../shared/form/Input"
import { useNavigate } from "react-router-dom";
import { login } from "../services/loginService";

export const LoginForm = () => {
    const navigate = useNavigate()

    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlerLogin = async (event: React.FormEvent) => {
        event.preventDefault(); // Evita recarga de página
        setError(null); // Limpia errores previos

        try {
            const response = await login(formData);
            localStorage.setItem("token", response.token);

            navigate("/hotel");
        } catch (err) {
            setError("Usuario o contraseña incorrectos."); // Manejo de errores
        }
    };

    return (
        <form onSubmit={handlerLogin} className="border border-border rounded-sm flex flex-col gap-7 py-10 px-14 w-[30%] shadow-xl">
            <span>
                <h1 className="font-bold text-2xl text-center">Inicio de sesión</h1>
                {error && <p className="text-red-500 text-center">{error}</p>}
            </span>
            <span className="flex flex-col gap-1">
                <label htmlFor="username" className="font-primary">Nombre</label>
                <Input name="username" placeholder="usuario" type="text" value={formData.username} onChange={handleChange} />
            </span>
            <span className="flex flex-col gap-1">
                <label htmlFor="password" className="font-primary">Nombre</label>
                <Input name="password" placeholder="contraseña" type="password" value={formData.password} onChange={handleChange} />
            </span>
            <span>
                <button type="submit" className="w-full bg-blue-500 hover:cursor-pointer hover:bg-blue-400 text-white rounded-sm px-5 py-3">
                    Iniciar sesión
                </button>
            </span>
        </form>
    )
}