import { Table } from "antd";
import { useEffect, useState } from "react";
import { SortableTitle } from "../sort/title/sortableTitle";
import { formatDate } from "../../../utils/formatDate";
import "./tableUI.css";

export const TableUI = ({ data }: { data: any }) => {
    const [sortedInfo, setSortedInfo] = useState<any>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<any | null>(null);


    useEffect(() => {
        console.log("data", data)
    }, [data]);

    const columns = [
        {

            title: () => (
                <SortableTitle
                    title="Huesped"
                    sortedColumn={sortedInfo?.columnKey === "name" ? sortedInfo : undefined}
                />
            ),
            dataIndex: ["name"],
            key: "name",
            sorter: (a: any, b: any) => a.room.name.localeCompare(b.room.nameEs),
            sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
        },
        {

            title: () => (
                <SortableTitle
                    title="Habitaciones"
                    sortedColumn={sortedInfo?.columnKey === "nameEs" ? sortedInfo : undefined}
                />
            ),
            dataIndex: ["room", "nameEs"],
            key: "nameEs",
            sorter: (a: any, b: any) => a.room.name.localeCompare(b.room.nameEs),
            sortOrder: sortedInfo.columnKey === 'nameEs' && sortedInfo.order,
        },
        {

            title: () => (
                <SortableTitle
                    title="Fecha inicio"
                    sortedColumn={sortedInfo?.columnKey === "initDate" ? sortedInfo : undefined}
                />
            ),
            dataIndex: "initDate",
            key: "initDate",
            render: formatDate,
            sorter: (a: any, b: any) => new Date(a.initDate[0], a.initDate[1] - 1, a.initDate[2]).getTime() - new Date(b.initDate[0], b.initDate[1] - 1, b.initDate[2]).getTime(),
            sortOrder: sortedInfo.columnKey === 'initDate' && sortedInfo.order,
        },
        {

            title: () => (
                <SortableTitle
                    title="Fecha fin"
                    sortedColumn={sortedInfo?.columnKey === "finisDate" ? sortedInfo : undefined}
                />
            ),
            dataIndex: "finishDate",
            key: "finishDate",
            render: formatDate,
            sorter: (a: any, b: any) => new Date(a.finishDate[0], a.finishDate[1] - 1, a.finishDate[2]).getTime() - new Date(b.finishDate[0], b.finishDate[1] - 1, b.finishDate[2]).getTime(),
            sortOrder: sortedInfo.columnKey === 'finishDate' && sortedInfo.order,
        },
        {
            title: () => (
                <SortableTitle
                    title="Categoria"
                    sortedColumn={sortedInfo?.columnKey === "categoryEs" ? sortedInfo : undefined}
                />
            ),
            dataIndex: ["categoryroom", "nameCategoryEs"],
            key: "categoryEs",
            sorter: (a: any, b: any) => a.categoryroom.nameCategoryEs.localeCompare(b.categoryroom.nameCategoryEs),
            sortOrder: sortedInfo.columnKey === 'categoryEs' && sortedInfo.order,
        },
        {
            title: () => (
                <SortableTitle
                    title="Pago"
                    sortedColumn={sortedInfo?.columnKey === "payment" ? sortedInfo : undefined}
                />
            ),
            dataIndex: "payment",
            key: "payment",
            render: (payment: number) => `$${payment.toFixed(2)}`,
            sorter: (a: any, b: any) => a.payment - b.payment,
            sortOrder: sortedInfo.columnKey === 'payment' && sortedInfo.order,
        },
        {
            title: () => (
                <SortableTitle
                    title="Cant. personas"
                    sortedColumn={sortedInfo?.columnKey === "cantPeople" ? sortedInfo : undefined}
                />
            ),
            dataIndex: "cantPeople",
            key: "cantPeople",
            sorter: (a: any, b: any) => a.cantPeople - b.cantPeople,
            sortOrder: sortedInfo.columnKey === 'cantPeople' && sortedInfo.order,
        },
        {
            title: "Teléfono",
            dataIndex: "phone",
            key: "phone"
        },

        {
            title: "Acciones",
            key: "actions",
            render: (_: any, record: any) => (
                <div className="flex gap-2">
                <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => handleEdit(record)}
                >
                    Editar
                </button>
                <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(record.reservationId)}
                >
                    Eliminar
                </button>
                </div>
        )
        }


    ];

    const handleEdit = (reservation: any) => {
  setSelectedReservation(reservation);
  setModalOpen(true);
};

const handleDelete = async (id: number) => {
  // Confirmación y llamada a API DELETE
};


    const handleChange = (pagination: any, filters: any, sorter: any) => {
        setSortedInfo(sorter);
    };

    return (
        <Table
            dataSource={data.map((item: any) => ({ ...item, key: item.reservationId }))}
            columns={columns} //TODO: revisar el error de tipado
            pagination={{ pageSize: 6 }}
            onChange={handleChange}
        />
    );
};