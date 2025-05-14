import { CiFilter, CiSearch } from "react-icons/ci";
import { useEffect, useState } from "react";
import { Divider } from 'antd';
import { FilterSelectUI } from "../filterSelect/filterSelectUI";
import { GetRooms } from "../../../../room/services/roomServices";
import { FilterCalendarUI } from "../filterCalendar/filterCalendarUI";
import { IoIosArrowRoundForward } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { getAllCategoriesRoom } from "../../../../category/services/categoryService";
import { IoBedOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { MdCalendarToday } from "react-icons/md";
import AddButton from "../../../../shared/buttons/addButton";

interface FilterContainerProps {
  results: number;
  setFilters: (filters: any) => void;
  onAdd: () => void; // <-- función para abrir modal de "Agregar"
}

export const FilterContainer = ({ results, setFilters, onAdd }: FilterContainerProps) => {
  const [filters, setLocalFilters] = useState<any>({});
  const [roomsList, setRoomsList] = useState<{ name: string | undefined; code: number }[]>([]);
  const [categoryList, setCategoryList] = useState<{ name: string; code: number }[]>([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handlerShowFilters = () => {
    setLocalFilters(!filters);
  };

  useEffect(() => {
    getCategory();
    getRooms();
  }, []);

  const getCategory = async () => {
    try {
      const response = await getAllCategoriesRoom();
      setCategoryList(
        response.map((category) => ({
          name: category.nameCategoryEs,
          code: category.categoryRoomId,
        }))
      );
    } catch (error) {
      console.log("error categorias room", error);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setLocalFilters(newFilters);
    setFilters(newFilters);
  };

  const getRooms = async () => {
    try {
      const fetchRooms = await GetRooms();
      if (!Array.isArray(fetchRooms)) {
        throw new Error("Expected an array from GetRooms()");
      }
      setRoomsList(
        fetchRooms.map((room) => ({
          name: room.nameEs,
          code: room.roomId,
        }))
      );
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const filteredRooms = roomsList.filter((room) => room.name?.includes(searchTerm));

  return (
    <>
      <div className="flex justify-between">
        <p>{results} resultados</p>
        <span className="flex gap-5">
          <span
            className={`flex gap-3 items-center hover:cursor-pointer px-3 py-2 rounded-full ${filters && "bg-gray-300"}`}
            onClick={() => handlerShowFilters()}
          >
            <CiFilter size={20} />
            <p>Filtros</p>
          </span>
          <span
            className="flex gap-3 items-center hover:cursor-pointer px-3 py-2 rounded-full"
            onClick={() => setSearchVisible(!searchVisible)}
          >
            <CiSearch size={20} />
            <p>Buscar</p>
          </span>
          <AddButton onClick={onAdd} /> {/* ✅ Este botón abre el modal */}
        </span>
      </div>

      {!filters && <Divider className="bg-black opacity-15 p-0 m-0" style={{ margin: "1% 0%" }} />}

      {searchVisible && (
        <div className="flex justify-end mt-3">
          <input
            type="text"
            placeholder="Buscar habitación..."
            className="border border-gray-300 rounded-md px-3 py-2 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <AnimatePresence>
        {filters && (
          <motion.div
            key="filters"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="grid grid-cols-4 gap-14 bg-[#f5e79a] py-2 px-5 mt-3 mb-7"
          >
            <FilterSelectUI
              data={roomsList}
              title={
                <span className="flex gap-2 items-center">
                  <IoBedOutline size={22} />
                  <p>Habitación</p>
                </span>
              }
              placeholder="Seleccionar habitación"
              onChange={(value) => handleFilterChange("room", value)}
            />
            <FilterSelectUI
              data={categoryList}
              title={
                <span className="flex gap-2 items-center">
                  <BiCategory size={22} />
                  <p>Categoria</p>
                </span>
              }
              placeholder="Seleccionar categoria"
              onChange={(value) => handleFilterChange("category", value)}
            />
            <div className="col-span-2 grid grid-flow-col auto-cols-auto w-full items-center gap-1">
              <FilterCalendarUI
                title={
                  <span className="flex gap-2 items-center">
                    <MdCalendarToday size={18} />
                    <p>Fecha inicio</p>
                  </span>
                }
                filterKey="startDate"
                onFilterChange={handleFilterChange}
              />
              <span className="flex flex-col items-center pt-4">
                <IoIosArrowRoundForward size={28} color="#c78219" />
              </span>
              <FilterCalendarUI
                title={
                  <span className="flex gap-2 items-center">
                    <MdCalendarToday size={18} />
                    <p>Fecha fin</p>
                  </span>
                }
                filterKey="endDate"
                onFilterChange={handleFilterChange}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
