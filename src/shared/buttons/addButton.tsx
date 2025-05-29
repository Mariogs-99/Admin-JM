import { FC } from "react";

interface AddButtonInterface {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const AddButton: FC<AddButtonInterface> = ({ onClick }) => {
  return (
    <span>
      <button
        onClick={onClick}
        className="bg-[#b49a7b] hover:bg-[#a67c52] active:bg-[#946846] text-white px-6 py-2 rounded-md transition-colors duration-200"
      >
        Agregar
      </button>
    </span>
  );
};

export default AddButton;
