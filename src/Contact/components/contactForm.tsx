
import { useEffect, useState } from "react";
import Input from "../../shared/form/Input"
import { GetContact, SaveContact } from "../services/contactServices";
import { MapHelp } from "../../hotel/components/MapHelp";
import { MapPreviewComponent } from "../../hotel/components/mapPreviewComponent";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const ContactForm = () => {

    let [formData, setFormData] = useState({
        facebookUsername: "",
        facebookUrl: "",
        instagram: "",
        telephone2: "",
        telephone: "",
        email: "",
        address: "",
        addressUrl: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlerSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await SaveContact(formData)
            console.log(response)
            toast.success("Contacto guardado exitosamente!");
        }
        catch (error) {
            console.log(error)
            toast.error("Error al guardar el contacto");
        }
    }

    useEffect(() => {
        getContact()
    }, [])

    const getContact = async () => {
        try {
            const response = await GetContact();
            console.log(response[0]);

            if (response) {
                setFormData((prevData) => ({
                    ...prevData,
                    ...response[0]
                }));
            }
        } catch (error) {
            console.error("Error fetching contact data", error);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center rounded-md w-full ">
            <form action="" onSubmit={handlerSubmit} className="px-10 py-5 border border-border rounded-sm w-[50%]">
                <div className="justify-between gap-10">
                    <span className="flex flex-col w-full gap-7">

                        <span className="flex justify-between gap-5">
                            <span className="flex flex-col gap-1 w-full">
                                <label htmlFor="telephone" className="font-primary">Telefono</label>
                                <Input name="telephone" placeholder="Nombre Hotel" type="number" value={formData.telephone} onChange={handleChange} />
                            </span>
                            <span className="flex flex-col gap-1 w-full">
                                <label htmlFor="telephone2" className="font-primary">Telefono 2</label>
                                <Input name="telephone2" placeholder="Nombre Hotel" type="number" value={formData.telephone2} onChange={handleChange} />
                            </span>
                        </span>
                        <span className="flex flex-col gap-1">
                            <label htmlFor="email" className="font-primary">Correo</label>
                            <Input name="email" placeholder="Nombre Hotel" type="email" value={formData.email} onChange={handleChange} />
                        </span>
                        <span className="flex flex-col gap-1">
                            <label htmlFor="address" className="font-primary">Dirección</label>
                            <Input name="address" placeholder="Direccion" type="text" value={formData.address} onChange={handleChange} />
                        </span>

                        <span className="flex justify-between gap-5">
                            <span className="flex flex-col gap-1 w-full">
                                <label htmlFor="facebookUsername" className="font-primary">Facebook usuario</label>
                                <Input name="facebookUsername" placeholder="nombre usuario" type="text" value={formData.facebookUsername} onChange={handleChange} className="w-full" />
                            </span>
                            <span className="flex flex-col gap-1 w-full">
                                <label htmlFor="facebookUrl" className="font-primary">Facebook url</label>
                                <Input name="facebookUrl" placeholder="url" type="text" value={formData.facebookUrl} onChange={handleChange} />
                            </span>
                        </span>
                        <span className="flex flex-col gap-1">
                            <label htmlFor="instagram" className="font-primary">Usuario de Instragram</label>
                            <Input name="instagram" placeholder="Usuario nstagram" type="text" value={formData.instagram} onChange={handleChange} />
                        </span>
                        <span className="pb-5">
                            <span className="flex flex-col gap-1">
                                <span className="flex gap-1">
                                    <label htmlFor="addressUrl" className="font-primary">Ubicación en el mapa</label>
                                    <MapHelp />
                                </span>
                                <Input name="addressUrl" placeholder="Dirección url google maps" type="text" value={formData.addressUrl} onChange={handleChange} />
                            </span>
                            <MapPreviewComponent />
                        </span>
                    </span>
                </div>
                <button className="bg-primary text-white px-10 rounded-sm w-full py-3 self-start">Guardar</button>
            </form>
            <ToastContainer />
        </div>
    )
}