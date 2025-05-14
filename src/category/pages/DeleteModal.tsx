import { Modal } from "antd";
import { FC } from "react";

interface DeleteModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  content?: string;
}

export const DeleteModal: FC<DeleteModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  title = "¿Eliminar categoría?",
  content = "Esta acción no se puede deshacer.",
}) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Eliminar"
      cancelText="Cancelar"
      okButtonProps={{ danger: true }}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{content}</p>
    </Modal>
  );
};
