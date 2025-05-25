import { useEffect, useState } from "react";
import Input from "../../shared/form/Input";
import { GetContact, SaveContact } from "../services/contactServices";
import { MapHelp } from "../../hotel/components/MapHelp";
import { MapPreviewComponent } from "../../hotel/components/mapPreviewComponent";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Contact } from "../interfaces/ContactInterfaces";

export const ContactForm = () => {
  const [formData, setFormData] = useState<Contact>({
    telephone: "",
    telephone2: "",
    address: "",
    addressUrl: "",
    email: "",
    instagramUsername: "",
    facebookUsername: "",
    facebookUrl: "",
    tiktok: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlerSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await SaveContact(formData);
      toast.success("¡Información actualizada correctamente!");
    } catch (error) {
      toast.error("Error al guardar el contacto");
    }
  };

  const getContact = async () => {
    try {
      const response = await GetContact();
      setFormData({ ...response });
    } catch (error) {
      console.error("Error fetching contact data", error);
    }
  };

  useEffect(() => {
    getContact();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center rounded-md w-full">
      <form onSubmit={handlerSubmit} className="px-10 py-5 border border-border rounded-sm w-[50%]">
        <div className="flex flex-col gap-6">
          <div className="flex gap-5">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="telephone" className="font-primary">Teléfono principal</label>
              <Input name="telephone" placeholder="Ej. +503 1234 5678" type="text" value={formData.telephone} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="telephone2" className="font-primary">Teléfono secundario</label>
              <Input name="telephone2" placeholder="Ej. +503 8765 4321" type="text" value={formData.telephone2 ?? ""} onChange={handleChange} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-primary">Correo electrónico</label>
            <Input name="email" type="email" placeholder="correo@hotel.com" value={formData.email} onChange={handleChange} />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="address" className="font-primary">Dirección</label>
            <Input name="address" placeholder="Calle del hotel..." value={formData.address} onChange={handleChange} />
          </div>

          <div className="flex gap-5">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="facebookUsername" className="font-primary">Facebook (usuario)</label>
              <Input name="facebookUsername" placeholder="@hotel" value={formData.facebookUsername} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="facebookUrl" className="font-primary">Facebook (URL)</label>
              <Input name="facebookUrl" placeholder="https://facebook.com/hotel" value={formData.facebookUrl} onChange={handleChange} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="instagramUsername" className="font-primary">Instagram (usuario)</label>
            <Input name="instagramUsername" placeholder="@instagram" value={formData.instagramUsername} onChange={handleChange} />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="tiktok" className="font-primary">TikTok (usuario)</label>
            <Input name="tiktok" placeholder="@tiktok" value={formData.tiktok ?? ""} onChange={handleChange} />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <label htmlFor="addressUrl" className="font-primary">Ubicación en el mapa</label>
              <MapHelp />
            </div>
            <Input name="addressUrl" placeholder="https://maps.google.com/..." value={formData.addressUrl} onChange={handleChange} />
            <MapPreviewComponent />
          </div>

          <button type="submit" className="bg-primary text-white px-10 rounded-sm py-3 w-full">
            Guardar
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};
