import { FC } from "react";

interface AddButtonInterface {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const AddButton:FC<AddButtonInterface> = ({onClick}) => {
    return (
        <span>
            <button onClick={onClick} className="bg-primary-button px-7 py-3 text-white rounded-sm hover:cursor-pointer hover:bg-primary-button-hover active:bg-primary-button-Active">Agregar</button>
        </span>
    );
}

export default AddButton;