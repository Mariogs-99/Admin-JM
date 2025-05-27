import { useState } from "react";
import { Button } from "antd";
import { RestaurantTableAdmin } from "../pages/RestaurantTableAdmin";
import { RestaurantFormModal } from "../pages/RestaurantFormModal";
import { Restaurant } from "../interfaces/restaurantInterface";

export const RestaurantSectionForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);

  const handleOpenModal = () => {
    setEditingRestaurant(null); // modo agregar
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRestaurant(null);
  };

  const handleSuccess = () => {
    setRefresh(!refresh); // fuerza recarga de tabla
    handleCloseModal();
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant); // modo editar
    setIsModalOpen(true);
  };

  return (
    <section className="px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Restaurantes registrados</h2>
        <Button type="primary" onClick={handleOpenModal}>
          Agregar restaurante
        </Button>
      </div>

      <RestaurantTableAdmin refresh={refresh} onEdit={handleEdit} />

      <RestaurantFormModal
        visible={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        initialData={editingRestaurant}
      />
    </section>
  );
};
