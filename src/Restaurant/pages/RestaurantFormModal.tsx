import { useEffect, useState } from "react";
import { Modal, message, Switch, Upload, Button } from "antd";
import Input from "../../shared/form/Input";
import { UploadOutlined } from "@ant-design/icons";
import {
  SaveRestaurant,
  UpdateRestaurantWithFiles,
} from "../services/restaurantService";
import { Restaurant } from "../interfaces/restaurantInterface";

interface Props {
  visible: boolean;
  onClose: () => void;
  initialData?: Restaurant | null;
  onSuccess?: () => void;
}

export const RestaurantFormModal = ({
  visible,
  onClose,
  initialData,
  onSuccess,
}: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    description: "",
    descriptionEn: "",
    schedule: "",
    scheduleEn: "",
    highlighted: false,
    image: null as File | null,
    pdf: null as File | null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        nameEn: initialData.nameEn || "",
        description: initialData.description,
        descriptionEn: initialData.descriptionEn || "",
        schedule: initialData.schedule,
        scheduleEn: initialData.scheduleEn || "",
        highlighted: initialData.highlighted,
        image: null,
        pdf: null,
      });
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setFormData({
      name: "",
      nameEn: "",
      description: "",
      descriptionEn: "",
      schedule: "",
      scheduleEn: "",
      highlighted: false,
      image: null,
      pdf: null,
    });
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, highlighted: checked }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.nameEn.trim()) {
      message.error("El nombre en ambos idiomas es obligatorio");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("nameEn", formData.nameEn);
    form.append("description", formData.description);
    form.append("descriptionEn", formData.descriptionEn);
    form.append("schedule", formData.schedule);
    form.append("scheduleEn", formData.scheduleEn);
    form.append("highlighted", String(formData.highlighted));
    if (formData.image) form.append("image", formData.image);
    if (formData.pdf) form.append("pdf", formData.pdf);

    try {
      if (initialData) {
        await UpdateRestaurantWithFiles(
          initialData.restaurantId,
          form,
          formData.image,
          formData.pdf
        );
        message.success("Restaurante actualizado");
      } else {
        if (!formData.pdf) {
          message.error("El menú en PDF es obligatorio");
          return;
        }
        await SaveRestaurant(form);
        message.success("Restaurante guardado");
      }

      resetForm();
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      message.error("Error al guardar el restaurante");
    }
  };

  return (
    <Modal
      title={initialData ? "Editar restaurante" : "Agregar restaurante"}
      open={visible}
      onCancel={() => {
        resetForm();
        onClose();
      }}
      onOk={handleSubmit}
      okText="Guardar"
      cancelText="Cancelar"
      destroyOnClose
      width={960}
    >
      <div className="flex flex-col space-y-6 py-4">
        {/* Nombres y horarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label className="font-medium">Nombre (ES)</label>
            <Input
              name="name"
              placeholder="Ej: Restaurante El Mirador"
              value={formData.name}
              onChange={handleTextChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">Name (EN)</label>
            <Input
              name="nameEn"
              placeholder="E.g. El Mirador Restaurant"
              value={formData.nameEn}
              onChange={handleTextChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">Horario (ES)</label>
            <Input
              name="schedule"
              placeholder="Lunes a Domingo de 8:00am - 10:00pm"
              value={formData.schedule}
              onChange={handleTextChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">Schedule (EN)</label>
            <Input
              name="scheduleEn"
              placeholder="Monday to Sunday from 8:00am - 10:00pm"
              value={formData.scheduleEn}
              onChange={handleTextChange}
            />
          </div>
        </div>

        {/* Descripciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label className="font-medium">Descripción (ES)</label>
            <textarea
              name="description"
              placeholder="Breve descripción del restaurante"
              value={formData.description}
              onChange={handleTextChange}
              className="border border-gray-300 rounded px-3 py-2 font-sans resize-none w-full"
              rows={6}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">Description (EN)</label>
            <textarea
              name="descriptionEn"
              placeholder="Short restaurant description"
              value={formData.descriptionEn}
              onChange={handleTextChange}
              className="border border-gray-300 rounded px-3 py-2 font-sans resize-none w-full"
              rows={6}
            />
          </div>
        </div>

        {/* Destacado */}
        <div className="flex items-center gap-3 pl-1">
          <label className="font-medium">¿Destacado?</label>
          <Switch checked={formData.highlighted} onChange={handleSwitchChange} />
        </div>

        {/* Imagen y PDF */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label className="font-medium">Imagen del restaurante</label>
            <Upload
              beforeUpload={(file) => {
                setFormData((prev) => ({ ...prev, image: file }));
                return false;
              }}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Seleccionar imagen</Button>
            </Upload>
            {formData.image && (
              <span className="text-sm text-gray-500">{formData.image.name}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Menú en PDF</label>
            <Upload
              beforeUpload={(file) => {
                setFormData((prev) => ({ ...prev, pdf: file }));
                return false;
              }}
              showUploadList={false}
              accept=".pdf"
            >
              <Button icon={<UploadOutlined />}>Seleccionar PDF</Button>
            </Upload>
            {formData.pdf && (
              <span className="text-sm text-gray-500">{formData.pdf.name}</span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
