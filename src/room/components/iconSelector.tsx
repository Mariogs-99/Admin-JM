import React, { useState } from 'react';

// Importar todos los iconos
import capacity from '../../assets/icons/personIcon.png';
import bed from '../../assets/icons/bed.png';
import available from '../../assets/icons/available.png';
import air from '../../assets/icons/air.png';
import size from '../../assets/icons/size.png';
import pool2 from '../../assets/icons/pool2.png';
import foodIcon from '../../assets/icons/foodIcon.png';
import garden from '../../assets/icons/Garden.png';
import balcony from '../../assets/icons/balcony.png';
import bath from '../../assets/icons/bath.png';
import cleaning from '../../assets/icons/cleaning.png';
import tables from '../../assets/icons/tables.png';
import tv from '../../assets/icons/tv.png';
import wifi from '../../assets/icons/wifi.png';
import personalCleaning from '../../assets/icons/personal-cleaning.png';
import iron from '../../assets/icons/iron.png';
import closet from '../../assets/icons/closet.png';
import desktop from '../../assets/icons/desk.png';

const IconSelector = () => {
  // Utilizar los iconos importados
  const icons = [
    { name: 'capacity', path: capacity },
    { name: 'bed', path: bed },
    { name: 'available', path: available },
    { name: 'air', path: air },
    { name: 'size', path: size },
    { name: 'pool2', path: pool2 },
    { name: 'foodIcon', path: foodIcon },
    { name: 'garden', path: garden },
    { name: 'balcony', path: balcony },
    { name: 'bath', path: bath },
    { name: 'cleaning', path: cleaning },
    { name: 'tables', path: tables },
    { name: 'tv', path: tv },
    { name: 'wifi', path: wifi },
    { name: 'personalCleaning', path: personalCleaning },
    { name: 'iron', path: iron },
    { name: 'closet', path: closet },
    { name: 'desktop', path: desktop },
  ];

  const [selectedIcon, setSelectedIcon] = useState(icons[0]); // Usa el primer icono como valor inicial
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar la apertura del selector

  const handleIconSelect = (icon: React.SetStateAction<{ name: string; path: string; }>) => {
    setSelectedIcon(icon);
    setIsOpen(false); // Cierra el selector después de seleccionar el icono
  };

  return (
    <div className="border border-border rounded-sm ">
      {/* Contenedor que actúa como un "select" */}
      <div className="w-12 h-12 flex justify-center items-center" onClick={() => setIsOpen(!isOpen)}>
        <img src={selectedIcon.path} alt={selectedIcon.name} className="size-7" />
      </div>

      {/* Opciones de iconos desplegables */}
      {isOpen && (
        <div className="grid grid-cols-5 absolute gap-5 bg-white border border-border p-5">
          {icons.map((icon) => (
            <div
              key={icon.name}
              className="hover:bg-slate-100 p-3"
              onClick={() => handleIconSelect(icon)}
            >
              <img src={icon.path} alt={icon.name} className="size-7" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IconSelector;
