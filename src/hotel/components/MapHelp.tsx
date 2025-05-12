
import { useState } from "react";
import { IoHelpCircleSharp } from "react-icons/io5";
import { Modal } from 'antd';
import step1 from "../../assets/indications/step1.png"
import step2 from "../../assets/indications/step2.png"
import step3 from "../../assets/indications/step3.png"

export const MapHelp = () => {
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
            <button className="text-blue-500 hover:cursor-pointer" type="button" onClick={() => showModal()}>
                <IoHelpCircleSharp size={20} />
            </button>
            <Modal title="Manejo de ubicacón" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <ul className="list-decimal px-5 flex flex-col gap-5">
                    <li>
                        <span>Buscar la ubicacion por medio de google maps y buscar la opcion 'compartir'</span>
                        <img src={step1} alt="" />
                    </li>
                    <li>
                        <span>Dirijirse al apartado 'Insertar un mapa'</span>
                        <img src={step2} alt="" />
                    </li>
                    <li>
                        <span>Dar click en el botón "COPIAR HTML" y pegarlo en el formulario del sistema</span>
                        <img src={step3} alt="" />
                    </li>
                </ul>
            </Modal>
        </>
    )
}