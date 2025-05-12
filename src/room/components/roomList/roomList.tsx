import { useEffect, useState } from "react"
import { getRoomImages, GetRooms } from "../../services/roomServices"
import { RoomCard } from "../../interfaces/roomInterface"
import { RoomCardInformation } from "../roomCardInformation"

export const RoomList = ({ setResults, filter }: { setResults: any; filter: any }) => {
    const [roomList, setRoomList] = useState<RoomCard[]>([]);
    const [originalRoomList, setOriginalRoomList] = useState<RoomCard[]>([]);

    useEffect(() => {
        getRooms()
    }, [])

    const getRooms = async () => {
        try {
            const rooms = await GetRooms()
            setResults(rooms.length)
            const roomswithImages = await Promise.all(
                rooms.map(async (room) => {
                    const image = await getRoomImages(room.roomId);
                    return { ...room, image: image, key: room.roomId }; // Devuelve el objeto modificado
                })
            )
            setRoomList(roomswithImages);
            setOriginalRoomList(roomswithImages); // Guardar la lista original
            setResults(rooms.length);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!filter.searchTerm) {
            setRoomList(originalRoomList);
        } else {
            const filteredRooms = originalRoomList.filter((room) =>
                room.nameEs.toLowerCase().includes(filter.searchTerm.toLowerCase())
            );
            setRoomList(filteredRooms);
        }
    }, [filter, originalRoomList]);

    return (
        <section className="flex">
            <RoomCardInformation
                data={roomList}
            />
        </section>
    )
}