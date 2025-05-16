import { CiFilter, CiSearch } from "react-icons/ci";
import { useState } from "react";
import { Divider } from "antd";
import AddButton from "../../shared/buttons/addButton";

interface EventFilterContainerProps {
  results: number;
  onAdd: () => void;
}

export const EventFilterContainer = ({
  results,
  onAdd,
}: EventFilterContainerProps) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [filtersVisible, setFiltersVisible] = useState(false);

  const toggleFilters = () => setFiltersVisible(!filtersVisible);

  return (
    <>
      <div className="flex justify-between">
        <p>{results} resultados</p>
        <span className="flex gap-5">
          <span
            className={`flex gap-3 items-center hover:cursor-pointer px-3 py-2 rounded-full ${
              filtersVisible && "bg-gray-300"
            }`}
            onClick={toggleFilters}
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
          <AddButton onClick={onAdd} />
        </span>
      </div>

      {!filtersVisible && (
        <Divider className="bg-black opacity-15 p-0 m-0" style={{ margin: "1% 0%" }} />
      )}

      {searchVisible && (
        <div className="flex justify-end mt-3">
          <input
            type="text"
            placeholder="Buscar evento..."
            className="border border-gray-300 rounded-md px-3 py-2 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Aquí podrías agregar filtros personalizados en el futuro */}
      {filtersVisible && (
        <div className="mt-4 p-4 bg-yellow-50 border rounded-md text-sm text-gray-700">
          <p>Filtros disponibles próximamente (fecha, precio, estado...)</p>
        </div>
      )}
    </>
  );
};
