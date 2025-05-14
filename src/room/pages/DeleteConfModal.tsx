import { Modal } from "antd";

interface DeleteModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  entityName: string;
}

export const DeleteModal = ({ open, onCancel, onConfirm, entityName }: DeleteModalProps) => (
  <Modal
    open={open}
    onCancel={onCancel}
    onOk={onConfirm}
    okText="Sí, eliminar"
    cancelText="Cancelar"
    title={`¿Estás seguro de eliminar ${entityName}?`}
  >
    <p>Esta acción no se puede deshacer.</p>
  </Modal>
);
