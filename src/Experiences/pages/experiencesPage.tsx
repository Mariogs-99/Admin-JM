import { Modal, message } from "antd";
import { useEffect, useState } from "react";
import { Title } from "../../shared/text/title";
import { getExperiences, deleteExperience } from "../services/experiencesServices";
import { Experience } from "../interfaces/Experience";
import ExperienceFormModal from "./ExperienceFormModal";
import { ExperienceCardInformation } from "./ExperienceCardInformation";

function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<Experience | null>(null);

  const fetchExperiences = async () => {
    try {
      const data = await getExperiences();
      setExperiences(data);
    } catch (error) {
      console.error("Error al cargar experiencias", error);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setModalVisible(true);
  };

  const handleDelete = (experience: Experience) => {
    if (!experience.experienceId) {
      message.error("ID inválido para eliminar");
      return;
    }

    setExperienceToDelete(experience);
    setConfirmVisible(true);
  };

  const confirmDelete = async () => {
    if (!experienceToDelete?.experienceId) {
      message.error("ID de experiencia no válido");
      return;
    }

    try {
      await deleteExperience(experienceToDelete.experienceId);
      message.success("Experiencia eliminada");
      fetchExperiences();
    } catch (error) {
      message.error("Error al eliminar experiencia");
    } finally {
      setConfirmVisible(false);
      setExperienceToDelete(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center pb-6">
        <Title>Experiencias</Title>
        <button
          onClick={() => {
            setEditingExperience(null);
            setModalVisible(true);
          }}
          className="bg-[#b49a7b] hover:bg-[#a67c52] active:bg-[#946846] text-white px-6 py-2 rounded-md transition-colors duration-200"
        >
          Agregar experiencia
        </button>
      </div>

      <ExperienceCardInformation
        data={experiences}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ExperienceFormModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={() => {
          setModalVisible(false);
          fetchExperiences();
        }}
        initialData={editingExperience}
      />

      <Modal
        open={confirmVisible}
        title={`¿Eliminar experiencia "${experienceToDelete?.title}"?`}
        onOk={confirmDelete}
        onCancel={() => {
          setConfirmVisible(false);
          setExperienceToDelete(null);
        }}
        okText="Sí, eliminar"
        cancelText="Cancelar"
        okButtonProps={{ danger: true }}
      >
        <p>Esta acción no se puede deshacer.</p>
      </Modal>
    </>
  );
}

export default ExperiencesPage;
