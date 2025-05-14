import { useEffect, useState } from "react";
import { getRoomImages, GetRooms } from "../../services/roomServices";
import { RoomCard } from "../../interfaces/roomInterface";
import { RoomCardInformation } from "../roomCardInformation";

export const RoomList = ({
  setResults,
  filter,
  refetchTrigger,
  setRoomToEdit,
  setModalOpen,
  onDeleteRoom, // 👈 nueva prop
}: {
  setResults: any;
  filter: any;
  refetchTrigger: boolean;
  setRoomToEdit: (room: RoomCard | null) => void;
  setModalOpen: (visible: boolean) => void;
  onDeleteRoom: (roomId: number) => void; // 👈 nueva prop
}) => {
  const [roomList, setRoomList] = useState<RoomCard[]>([]);
  const [originalRoomList, setOriginalRoomList] = useState<RoomCard[]>([]);

  const getRooms = async () => {
    try {
      const rooms = await GetRooms();
      setResults(rooms.length);
      const roomswithImages = await Promise.all(
        rooms.map(async (room) => {
          const image = await getRoomImages(room.roomId);
          return { ...room, image: image, key: room.roomId };
        })
      );
      setRoomList(roomswithImages);
      setOriginalRoomList(roomswithImages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRooms();
  }, [refetchTrigger]);

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

  const handleEditRoom = (room: RoomCard) => {
    setRoomToEdit(room);
    setModalOpen(true);
  };

  const handleDeleteRoom = (id: number) => {
    onDeleteRoom(id); // 👈 delegamos al RoomPage
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
