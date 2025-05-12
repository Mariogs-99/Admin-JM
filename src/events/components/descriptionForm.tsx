import { useEffect, useState } from "react";
import Input from "../../shared/form/Input"
import { saveSection } from "../../shared/services/sectionServices";

export const DescriptionForm = () => {
    const [formData, setFormData] = useState({
        descripion: "",
    });

    useEffect(() => {
            
    },[])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        const data = {
            title: "eventos",
            description: formData.descripion,
            categoryId:3
        }
        try {
            const response = await  saveSection(data)
            console.log(response)
        }
        catch(error) {
            console.log(error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <span className="flex flex-col gap-1">
                <label htmlFor="descripion" className="font-primary">Descripción</label>
                <Input name="descripion" placeholder="Descripción de la seccion de eventos" type="text" value={formData.descripion} onChange={handleChange} />
            </span>
            <button type="submit" className="bg-blue-500 text-white px-7 py-3 self-start rounded-sm">Guardar</button>
        </form>
    )
}