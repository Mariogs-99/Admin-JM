import { Divider } from "antd";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import AddButton from "../../../../shared/buttons/addButton";

interface Props {
  results: any;
  setFilters: (filters: any) => void;
  onAdd: () => void; //!Nueva prop para abrir el modal
}

export const FilterContainer = ({ results, setFilters, onAdd }: Props) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOnChange = (e: any) => {
    setSearchTerm(e.target.value);
    setFilters(e.target.value);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <p>{results} resultados</p>
        <span className="flex gap-5">
          <span
            className={`${
              searchVisible && "bg-gray-300"
            } flex gap-3 items-center hover:cursor-pointer px-3 py-2 rounded-full`}
            onClick={() => setSearchVisible(!searchVisible)}
          >
            <CiSearch size={20} />
            <p>Buscar</p>
          </span>

          {/* ✅ Botón que abre el modal */}
          <AddButton onClick={onAdd} />
        </span>
      </div>

      <Divider className="bg-black opacity-15 p-0 m-0" style={{ margin: "1% 0%" }} />

      {searchVisible && (
        <div className="flex justify-end items-center gap-3 mt-3 p-5 bg-[#f5e79a]">
          <CiSearch size={20} />
          <input
            type="text"
            placeholder="Buscar habitación..."
            className="border border-gray-300 rounded-md px-3 py-2 w-full bg-white"
            value={searchTerm}
            onChange={handleOnChange}
          />
        </div>
      )}
    </>
  );
};
