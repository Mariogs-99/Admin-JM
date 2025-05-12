import { useEffect, useState } from "react";
import Input from "../../shared/form/Input"
import { getRoomCategory } from "../services/categoryService";

export const CategoryForm = () => {
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        description: "",
        category: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fetchCategories = async () => {
        try {
            const response = await getRoomCategory();
            console.log(response)

        } catch (err) {
            setError("Usuario o contraseña incorrectos."); // Manejo de errores
        }
    }

    useEffect(() => {
        setError(null); // Limpia errores previos
        fetchCategories();
    }, []);
    

    return (
        <form className="flex flex-col gap-6 my-7">
            {error && <p className="text-red-500 text-center">{error}</p>}
            <span className="flex flex-col gap-1">
                <label htmlFor="description" className="font-primary">Descripción</label>
                <Input name="description" placeholder="descripcion de la sección habitaciones" type="text" value={formData.description} onChange={handleChange} />
            </span>

            <span className="flex flex-col gap-1">
                <label htmlFor="category" className="font-primary">Categorias</label>
                <Input name="category" placeholder="Nombre Hotel" type="text" value={formData.category} onChange={handleChange} />
            </span>


        </form>
    )
}