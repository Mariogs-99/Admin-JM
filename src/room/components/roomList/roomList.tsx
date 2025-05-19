import { useEffect, useState } from "react";
import { GetRooms } from "../../services/roomServices";
import { RoomCardInformation } from "../roomCardInformation";

interface Room {
  roomId: number;
  nameEs: string;
  nameEn: string;
  maxCapacity: number;
  descriptionEs: string;
  descriptionEn: string;
  price: number;
  quantity: number;
  sizeBed: string;
  categoryRoomId: number;
  imageUrl?: string; // esto viene del backend
}

export const RoomList = ({
  setResults,
  filter,
  refetchTrigger,
  setRoomToEdit,
  setModalOpen,
  onDeleteRoom,
}: {
  setResults: (count: number) => void;
  filter: { searchTerm?: string };
  refetchTrigger: boolean;
  setRoomToEdit: (room: Room | null) => void;
  setModalOpen: (visible: boolean) => void;
  onDeleteRoom: (roomId: number) => void;
}) => {
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [originalRoomList, setOriginalRoomList] = useState<Room[]>([]);

  const getRooms = async () => {
    try {
      const rooms = await GetRooms();
      setResults(rooms.length);

      const formattedRooms = rooms.map((room: any) => ({
        ...room,
        key: room.roomId,
        imageUrl: room.imageUrl ? `/${room.imageUrl}` : "/img/default.jpg",
      }));

      setRoomList(formattedRooms);
      setOriginalRoomList(formattedRooms);
    } catch (error) {
      console.error("Error cargando habitaciones:", error);
    }
  };

  useEffect(() => {
    getRooms();
  }, [refetchTrigger]);

  useEffect(() => {
    if (!filter.searchTerm) {
      setRoomList(originalRoomList);
    } else {
      const filtered = originalRoomList.filter((room) =>
        room.nameEs.toLowerCase().includes(filter.searchTerm!.toLowerCase())
      );
      setRoomList(filtered);
    }
  }, [filter, originalRoomList]);

  const handleEditRoom = (room: Room) => {
    setRoomToEdit(room);
    setModalOpen(true);
  };

  const handleDeleteRoom = (id: number) => {
    onDeleteRoom(id);
  };

  return (
    <section className="flex w-full">
      <RoomCardInformation
        data={roomList}
        onEdit={handleEditRoom}
        onDelete={handleDeleteRoom}
      />
    </section>
  );
};
