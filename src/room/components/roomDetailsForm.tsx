import { useState } from "react";
import Input from "../../shared/form/Input"
import IconSelector from "../components/iconSelector"


export const RoomDetailsForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        capacity: "",
        total: "",
        detail: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log([e.target.value], [e.target.name])
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };    

    return (
        <span className="flex gap-2">
            <IconSelector />
            <Input name="detail" placeholder="descripción de la habitación" type="text" value={formData.detail} onChange={handleChange} />
        </span>
    )
}