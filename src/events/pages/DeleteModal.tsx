import { FC } from "react";
import { Modal, Typography, Button } from "antd";

const { Text } = Typography;

interface DeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export const DeleteModal: FC<DeleteModalProps> = ({
  visible,
  onClose,
  onConfirm,
  itemName = "el evento",
}) => {
  return (
    <Modal
      title="Confirmar eliminación"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className="flex flex-col gap-4">
        <Text>
          ¿Estás seguro de que deseas eliminar <b>{itemName}</b>? Esta acción no
          se puede deshacer.
        </Text>
        <div className="flex justify-end gap-3">
          <Button onClick={onClose}>Cancelar</Button>
          <Button danger type="primary" onClick={onConfirm}>
            Eliminar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
