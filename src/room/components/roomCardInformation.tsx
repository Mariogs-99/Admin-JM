
import { useState } from 'react';

import { Image, Table } from 'antd';

import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Card } from 'antd';

const { Meta } = Card;


import { SortableTitle } from '../../reservation/components/sort/title/sortableTitle';
import { image, img } from 'framer-motion/client';

export const RoomCardInformation = ({ data }: { data: any }) => {
    const [language, setLanguage] = useState('Es')
    const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false)
    const [sortedInfo, setSortedInfo] = useState<any>({});

    const getLocalizedText = (textEs?: string, textEn?: string) => {
        return language === 'Es' ? textEs ?? "No disponible" : textEn ?? "Not available";
    };


    const columns = [
        {
            title: () => (
                <SortableTitle
                    title="Habitación"
                    sortedColumn={sortedInfo?.columnKey === "nameEs" ? sortedInfo : undefined}
                />
            ),
            dataIndex: ["nameEs"],
            key: "nameEs",
            render: (text: string, record: any) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Image.PreviewGroup
                        items={record.image}
                    >
                        <Image
                            src={record.image[0]}
                            alt={text}
                            style={{ objectFit: 'cover', borderRadius: '5px' }}
                            width={100}
                            height={50}
                        />
                    </Image.PreviewGroup>
                    <span>{text}</span>
                </div>
            ),
            // sorter: (a: any, b: any) => a.room.name.localeCompare(b.room.nameEs),
            // sortOrder: sortedInfo.columnKey === 'nameEs' && sortedInfo.order,
        },
        {
            title: () => (
                <SortableTitle
                    title="Descripción"
                    sortedColumn={sortedInfo?.columnKey === "descriptionEs" ? sortedInfo : undefined}
                />
            ),
            dataIndex: ["descriptionEs"],
            key: "descriptionEs",
            // sorter: (a: any, b: any) => a.room.name.localeCompare(b.room.nameEs),
            // sortOrder: sortedInfo.columnKey === 'nameEs' && sortedInfo.order,
        },
        {
            title: () => (
                <SortableTitle
                    title="Precio"
                    sortedColumn={sortedInfo?.columnKey === "price" ? sortedInfo : undefined}
                />
            ),
            dataIndex: ["price"],
            key: "price",
            // sorter: (a: any, b: any) => a.room.name.localeCompare(b.room.nameEs),
            // sortOrder: sortedInfo.columnKey === 'nameEs' && sortedInfo.order,
        },
        {
            title: () => (
                <SortableTitle
                    title="Capacidad Maxima"
                    sortedColumn={sortedInfo?.columnKey === "maxCapacity" ? sortedInfo : undefined}
                />
            ),
            dataIndex: ["maxCapacity"],
            key: "maxCapacity",
            // sorter: (a: any, b: any) => a.room.name.localeCompare(b.room.nameEs),
            // sortOrder: sortedInfo.columnKey === 'nameEs' && sortedInfo.order,
        },
        {
            title: () => (
                <SortableTitle
                    title="Cama"
                    sortedColumn={sortedInfo?.columnKey === "sizeBed" ? sortedInfo : undefined}
                />
            ),
            dataIndex: ["sizeBed"],
            key: "sizeBed",
            // sorter: (a: any, b: any) => a.room.name.localeCompare(b.room.nameEs),
            // sortOrder: sortedInfo.columnKey === 'nameEs' && sortedInfo.order,
        },
        {
            title: "detalles",
            key: "details",
            render: () => <a>Ver detalles</a>,
            // sorter: (a: any, b: any) => a.room.name.localeCompare(b.room.nameEs),
            // sortOrder: sortedInfo.columnKey === 'nameEs' && sortedInfo.order,
        },

    ];

    const handleChange = (pagination: any, filters: any, sorter: any) => {
        setSortedInfo(sorter);
    };

    return (
        // <>
        //     <Card
        //         style={{ width: '100%' }}
        //         key={data.roomId}
        //         cover={
        //             <>
        //                 <Image.PreviewGroup
        //                     items={data.image}
        //                 >
        //                     <Image
        //                         height={200}
        //                         src={data.image[0]}
        //                         className='object-cover'
        //                     />
        //                 </Image.PreviewGroup>
        //             </>
        //         }
        //         actions={[
        //             <SettingOutlined key="setting" />,
        //             <EditOutlined key="edit" />,
        //             <EllipsisOutlined key="ellipsis" />,
        //         ]}
        //     >
        //         <Meta
        //             title={
        //                 <>
        //                     <span className='flex flex-col gap-1 pb-3'>
        //                         <span className='flex items-center gap-2'>
        //                             <p className='text-[1.1rem]'>{getLocalizedText(data.nameEs, data.nameEn)}</p>
        //                             <p className='opacity-50'>${data.price}</p>
        //                         </span>
        //                     </span>
        //                     <div className='flex justify-between'>
        //                         <span className="flex gap-3 items-center">
        //                             <img src={capacity} alt="" className="size-5" />
        //                             <p className='opacity-80 text-[1em] font-normal'>{getLocalizedText("Max.", "Max.")} {data.maxCapacity}</p>
        //                         </span>

        //                         <span className="flex gap-3 items-center">
        //                             <img src={bed} alt="" className="size-5" />
        //                             <p className='opacity-80 text-[1em] font-normal'>{getLocalizedText("Total.", "Total.")} 5</p>
        //                         </span>

        //                         <span className="flex items-center gap-2">
        //                             <img src={available} alt="" className="size-5" />
        //                             <p className='opacity-80 text-[1em] font-normal'>{getLocalizedText("Disponible", "Available:")}: 3</p>
        //                         </span>
        //                     </div>
        //                 </>
        //             }

        //             description={
        //                 <>
        //                     <p className='text-black text-justify pt-5'>{getLocalizedText(data.descriptionEs, data.descriptionEn)}</p>
        //                     <button className='flex items-center gap-2' onClick={() => setIsDetailsOpen(!isDetailsOpen)}>
        //                         {isDetailsOpen ?
        //                             <GoPlus size={22} />
        //                             :
        //                             <GoDash size={22} />
        //                         }
        //                         <span className='font-semibold'>{getLocalizedText("Detalles", "Available:")}</span>
        //                     </button>
        //                     <AnimatePresence>
        //                         {isDetailsOpen &&
        //                             <motion.div
        //                                 initial={{ opacity: 0, height: 0 }}
        //                                 animate={{ opacity: 1, height: "auto" }}
        //                                 exit={{ opacity: 0, height: 0 }}
        //                                 transition={{ duration: 0.2 }}
        //                                 className="grid grid-cols-2 py-5 gap-5"
        //                             >
        //                                 <span className="flex gap-3 items-center">
        //                                     <img src={air} className="size-7 opacity-70" />
        //                                     <p>Aire Acondicionado</p>
        //                                 </span>
        //                                 <span className="flex gap-3 items-center">
        //                                     <img src={size} className="size-7 opacity-70" />
        //                                     <p>18 m<sup>2</sup></p>
        //                                 </span>
        //                                 <span className="flex gap-3 items-center">
        //                                     <img src={pool2} className="size-7 opacity-70" />
        //                                     <p>Pisicna privada</p>
        //                                 </span>
        //                                 <span className="flex gap-3 items-center">
        //                                     <img src={balcony} className="size-7 opacity-70" />
        //                                     <p>Balcón</p>
        //                                 </span>
        //                                 <span className="flex gap-3 items-center">
        //                                     <img src={garden} className="size-7 opacity-70" />
        //                                     <p>Vista al jardin</p>
        //                                 </span>
        //                                 <span className="flex gap-3 items-center">
        //                                     <img src={bath} className="size-7 opacity-70" />
        //                                     <p>Bañera</p>
        //                                 </span>
        //                                 <span className="flex gap-3 items-center">
        //                                     <img src={tables} className="size-7 opacity-70" />
        //                                     <p>Zona de comedor exterior</p>
        //                                 </span>
        //                                 <span className="flex gap-3 items-center">
        //                                     <img src={tv} className="size-7 opacity-70" />
        //                                     <p>TV de pantalla plana</p>
        //                                 </span>
        //                                 <span className="flex gap-3 items-center">
        //                                     <img src={foodIcon} className="size-7 opacity-70" />
        //                                     <p>Desayuno(incluido)</p>
        //                                 </span>
        //                                 <span className="flex gap-3 items-center">
        //                                     <img src={wifi} className="size-7 opacity-70" />
        //                                     <p>Wifi gratis</p>
        //                                 </span>
        //                                 <span className="flex gap-3 items-center">
        //                                     <img src={tables} className="size-7 opacity-70" />
        //                                     <p>Muebles de exterior</p>
        //                                 </span>
        //                                 <span className="flex gap-3 items-center">
        //                                     <img src={closet} className="size-7 opacity-70" />
        //                                     <p>Armario</p>
        //                                 </span>
        //                                 <span className="flex gap-3 items-center">
        //                                     <img src={cleaning} className="size-7 opacity-70" />
        //                                     <p>Desinfectante de manos</p>
        //                                 </span>
        //                                 <span className="flex gap-3 items-center">
        //                                     <img src={desktop} className="size-7 opacity-70" />
        //                                     <p>Escritorio</p>
        //                                 </span>
        //                                 <span className="flex gap-3 items-center">
        //                                     <img src={closet} className="size-7 opacity-70" />
        //                                     <p>Armario</p>
        //                                 </span>
        //                                 <span className="flex gap-3 items-center">
        //                                     <img src={personalCleaning} className="size-7 opacity-70" />
        //                                     <p>Desinfectante de manos</p>
        //                                 </span>
        //                                 <span className="flex gap-3 items-center">
        //                                     <img src={iron} className="size-7 opacity-70" />
        //                                     <p>Utensilio de planchado</p>
        //                                 </span>
        //                             </motion.div>
        //                         }
        //                     </AnimatePresence>
        //                 </>

        //             }
        //         />
        //     </Card>
        // </>

        <>
            <Table
                dataSource={data.map((item: any) => ({ ...item, key: item.roomId }))}
                columns={columns} //TODO: revisar el error de tipado
                pagination={{ pageSize: 6 }}
                onChange={handleChange}
            />
        </>
    )
}