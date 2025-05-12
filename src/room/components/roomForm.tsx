import { useState } from "react";
import Input from "../../shared/form/Input"
import { RoomDetailsForm } from "./roomDetailsForm";

export const RoomForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        capacity: "",
        total: "",
        description: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log([e.target.value], [e.target.name])
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <form className="grid md:grid-cols-2 gap-10 p-10">
                <div className="flex flex-col gap-5">
                    <span className="flex flex-col ">
                        <label htmlFor="name">Nombre</label>
                        <Input name="name" placeholder="Nombre habitación" type="text" value={formData.name} onChange={handleChange} />
                    </span>
                    <span className="flex flex-col">
                        <label htmlFor="precio">Precio</label>
                        <Input name="precio" placeholder="Precio" type="number" value={formData.price} onChange={handleChange} />
                    </span>
                    <span className="flex flex-col">
                        <label htmlFor="capacity">Capacidad</label>
                        <Input name="capacity" placeholder="Capacidad maxima de personas" type="number" value={formData.capacity} onChange={handleChange} />
                    </span>
                    <span className="flex flex-col">
                        <label htmlFor="total">Total</label>
                        <Input name="total" placeholder="Total de habitaciones" type="number" value={formData.total} onChange={handleChange} />
                    </span>
                    <span className="flex flex-col">
                        <label htmlFor="description">Descripción</label>
                        <Input name="description" placeholder="descripción de la habitación" type="text" value={formData.description} onChange={handleChange} />
                    </span>
                </div>
                <div>
                    <h2>Detalles</h2>
                    <div>
                        <RoomDetailsForm />
                        <button className="border border-border px-5 py-3">+ Mas detalles</button>
                    </div>
                </div>
            </form>

        </>
    )
}