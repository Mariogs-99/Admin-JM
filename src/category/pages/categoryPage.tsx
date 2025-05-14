import { useEffect, useState } from "react";
import { Title } from "../../shared/text/title";
import { CategoryCard } from "../components/categoryCard";
import { Button, message } from "antd";
import {
  getAllCategoriesRoom,
  deleteCategoryRoom,
} from "../services/categoryService";
import { CategoryRoom } from "../../room/interfaces/roomInterface";
import { CategoryFormModal } from "./CategoryFormModal";
import { DeleteModal } from "./DeleteModal";

export const CategoryPage = () => {
  const [categories, setCategories] = useState<CategoryRoom[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRoom | null>(null);

  // Nuevo: para eliminar
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const loadCategories = async () => {
    try {
      const data = await getAllCategoriesRoom();
      setCategories(data);
    } catch {
      message.error("Error al cargar las categorías");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setDeleteVisible(true);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) {
      try {
        await deleteCategoryRoom(deleteId);
        message.success("Categoría eliminada");
        setDeleteVisible(false);
        setDeleteId(null);
        loadCategories();
      } catch {
        message.error("Error al eliminar");
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <Title>Tipos de habitación</Title>
        <Button
          type="primary"
          onClick={() => {
            setEditingCategory(null);
            setModalVisible(true);
          }}
        >
          Agregar Categoría
        </Button>
      </div>

      <div>
        <h2 className="font-semibold text-lg">Lista de categorías</h2>
        <span className="h-full flex flex-col justify-center pt-1 pb-5">
          <hr className="opacity-20" />
        </span>
        <span className="grid grid-cols-2 gap-7">
          {categories.map((category) => (
            <CategoryCard
              key={category.categoryRoomId}
              category={category.nameCategoryEs}
              description={category.descriptionEs}
              maxPeople={category.maxPeople}
              bedInfo={category.bedInfo}
              roomSize={category.roomSize}
              hasTv={category.hasTv}
              hasAc={category.hasAc}
              hasPrivateBathroom={category.hasPrivateBathroom}
              onEdit={() => {
                setEditingCategory(category);
                setModalVisible(true);
              }}
              onDelete={() => openDeleteModal(category.categoryRoomId)}
            />
          ))}
        </span>
      </div>

      <CategoryFormModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={loadCategories}
        initialData={editingCategory}
      />

      <DeleteModal
        visible={deleteVisible}
        onCancel={() => {
          setDeleteVisible(false);
          setDeleteId(null);
        }}
        onConfirm={confirmDelete}
        title="¿Estás seguro de eliminar esta categoría?"
        content="Esta acción eliminará permanentemente la categoría seleccionada."
      />
    </>
  );
};
