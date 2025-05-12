import { IoTodayOutline, IoBedOutline, IoSparklesOutline, IoFastFoodOutline, IoLogOutOutline } from "react-icons/io5";

import { BiCategory } from "react-icons/bi";
import { LuHotel } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { Tooltip } from 'antd';

const items = [
    {
        key: '1',
        icon: <LuHotel size={12} />,
        label: 'Hotel',
        url: 'hotel'
    },
    {
        key: '2',
        icon: <BiCategory size={12}/>,
        label: 'Tipos de habitaciones',
        url: 'reservaciones'
    },
    {
        key: '3',
        icon: <IoBedOutline size={12}/>,
        label: 'Habitaciones',
        url: 'habitaciones'
    },
    {
        key: '4',
        icon: <IoTodayOutline size={12}/>,
        label: 'Eventos',
        url: 'eventos'
    },
    {
        key: '5',
        icon: <IoSparklesOutline size={12}/>,
        label: 'Experiencias',
        url: 'experiencias'
    },
    {
        key: '6',
        icon: <IoFastFoodOutline size={12}/>,
        label: 'Restaurante',
        url: 'restaurante'
    },
]

export const Menu = () => {
    const navigate = useNavigate();

    return (
        <nav className=" h-screen flex flex-col justify-center items-center">
            <div>
                {items.map(item => (
                    <Tooltip placement="right" title={item.label}>
                        <div className='p-3 my-5 hover:bg-primary-bg hover:brightness-125 hover:opacity-100 rounded-md opacity-80 hover:scale-125' onClick={() => navigate(item.url)}>
                            {item.icon}
                        </div>
                    </Tooltip >
                ))}
            </div>
            <span className="flex flex-col pt-20">
                <hr className="opacity-20" />
                <span className='p-5 hover:bg-slate-100 rounded-md'>
                    <IoLogOutOutline size={25} />
                </span>
            </span>

        </nav>
    )
}