import { useState } from "react";
import Input from "../../shared/form/Input";

export const RestaurantSectionForm = () => {
    const [formData, setFormData] = useState({
        horarios: "",
        menu: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e)
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    

    return (
        <form action="submit" className="flex flex-col gap-7 py-10">
            <span className="flex flex-col gap-1">
                <label htmlFor="horarios" className="font-primary">Horarios</label>
                <Input name="horarios" placeholder="Horarios" type="text" value={formData.horarios} onChange={handleChange} />
            </span>
            <span className="flex flex-col gap-1">
                <label htmlFor="menu" className="font-primary">Menu</label>
                <Input name="menu" placeholder="Dirección url google maps" type="file" value={formData.menu} onChange={handleChange} />
            </span>
        </form>
    )
}