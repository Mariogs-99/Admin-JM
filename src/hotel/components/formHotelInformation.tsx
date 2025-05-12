
import { useState } from "react";
import { MapPreviewComponent } from "./mapPreviewComponent"
import Input from "../../shared/form/Input"
import { MapHelp } from "./MapHelp";

export const FormHotelInformation = () => {
    const [formData, setFormData] = useState({
        hotelName: "",
        location: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form action="submit" className="flex flex-col gap-10">
            <span className="">
                <span className="flex flex-col gap-1">
                    <span className="flex gap-1">
                        <label htmlFor="location" className="font-primary">Ubicación en el mapa</label>
                        <MapHelp />
                    </span>
                    <Input name="location" placeholder="Dirección url google maps" type="text" value={formData.location} onChange={handleChange} />
                </span>
                <MapPreviewComponent />
            </span>
        </form>
    )
}