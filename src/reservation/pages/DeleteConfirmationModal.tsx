import { Modal } from "antd";
import { FC } from "react";

interface DeleteConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal: FC<DeleteConfirmationModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      open={visible}
      title="¿Estás seguro de eliminar esta reserva?"
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Sí"
      cancelText="No"
      centered
    >
      Esta acción no se puede deshacer.
    </Modal>
  );
};
