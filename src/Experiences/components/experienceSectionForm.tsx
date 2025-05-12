import { useState } from "react";
import Input from "../../shared/form/Input"

export const ExperienceSectionForm = () => {
    const [formData, setFormData] = useState({
        descripion: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form action="submit" className="flex flex-col">
            <span className="flex flex-col gap-1">
                <label htmlFor="descripion" className="font-primary">Experiencias</label>
                <Input name="descripion" placeholder="Descripción de la seccion de experiencias" type="text" value={formData.descripion} onChange={handleChange} />
            </span>
            
        </form>
    )
}