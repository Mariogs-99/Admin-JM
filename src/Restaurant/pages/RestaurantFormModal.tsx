import { useEffect, useState } from "react";
import { Modal, message, Switch, Upload, Button } from "antd";
import Input from "../../shared/form/Input";
import { UploadOutlined } from "@ant-design/icons";
import { SaveRestaurant, UpdateRestaurantWithFiles } from "../services/restaurantService";
import { Restaurant } from "../interfaces/restaurantInterface";

interface Props {
  visible: boolean;
  onClose: () => void;
  initialData?: Restaurant | null;
  onSuccess?: () => void; // ✅ soporte para prop opcional onSuccess
}

export const RestaurantFormModal = ({
  visible,
  onClose,
  initialData,
  onSuccess,
}: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    schedule: "",
    highlighted: false,
    image: null as File | null,
    pdf: null as File | null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        schedule: initialData.schedule,
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
      description: "",
      schedule: "",
      highlighted: false,
      image: null,
      pdf: null,
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, highlighted: checked }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      message.error("El nombre es obligatorio");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("schedule", formData.schedule);
    form.append("highlighted", String(formData.highlighted));
    if (formData.image) form.append("image", formData.image);
    if (formData.pdf) form.append("pdf", formData.pdf);

    try {
      if (initialData) {
        await UpdateRestaurantWithFiles(initialData.restaurantId, form);
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
      onSuccess?.(); // ✅ llama onSuccess si fue proporcionado
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
    >
      <div className="flex flex-col gap-4 mt-2">
        <Input
          name="name"
          placeholder="Nombre del restaurante"
          value={formData.name}
          onChange={handleTextChange}
        />
        <Input
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleTextChange}
        />
        <Input
          name="schedule"
          placeholder="Horarios"
          value={formData.schedule}
          onChange={handleTextChange}
        />

        <Upload
          beforeUpload={(file) => {
            setFormData((prev) => ({ ...prev, image: file }));
            return false;
          }}
          showUploadList={false}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>Subir imagen</Button>
        </Upload>
        {formData.image && (
          <span className="text-sm text-gray-500">{formData.image.name}</span>
        )}

        <Upload
          beforeUpload={(file) => {
            setFormData((prev) => ({ ...prev, pdf: file }));
            return false;
          }}
          showUploadList={false}
          accept=".pdf"
        >
          <Button icon={<UploadOutlined />}>Subir menú (PDF)</Button>
        </Upload>
        {formData.pdf && (
          <span className="text-sm text-gray-500">{formData.pdf.name}</span>
        )}

        <div className="flex items-center gap-2">
          <label className="font-medium">¿Destacado?</label>
          <Switch checked={formData.highlighted} onChange={handleSwitchChange} />
        </div>
      </div>
    </Modal>
  );
};
