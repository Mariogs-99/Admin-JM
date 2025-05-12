import { Button, Modal } from "antd";
import { useState } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

export const MapPreviewComponent = () => {
    const [previewMap, setPreviewMap] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <button onClick={showModal} type="button" className="flex gap-2 py-2 text-sm text-blue-500 hover:text-blue-400 hover:cursor-pointer" >
                <EyeOutlined />
                <p>Vista previa</p>
            </button>
            <Modal title="Ubicación en google maps" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={'70%'}>
                <div className=" h-[60vh] bg-border">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3872.395412687619!2d-89.0274735!3d13.935046100000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f636be212fc02b9%3A0xa91d6ccc9a2f91e4!2sHotel%20Jard%C3%ADn%20de%20las%20Mar%C3%ADas!5e0!3m2!1ses!2ssv!4v1738964974010!5m2!1ses!2ssv" width="100%" height="100%" allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </Modal>
        </>
    )
}