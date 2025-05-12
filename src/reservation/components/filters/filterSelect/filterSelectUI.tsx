
import React, { JSX, useEffect, useState } from "react";
import { FloatLabel } from 'primereact/floatlabel';
import { Dropdown } from 'primereact/dropdown';
import "./SelectCustomStyle.css"

const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
};

export const FilterSelectUI = ({ data, title, placeholder, onChange }: { data: any; title: JSX.Element; placeholder:string; onChange: (value: any) => void }) => {
    const [value, setValue] = useState(null);

    const handleChange = (e: any) => {
        console.log("cahnge filter", e.value)
        setValue(e.value);
        onChange(e.value); // Notificar cambio
    };

    return (
        <div className="flex flex-col gap-1">
            <label htmlFor="dd-city" className="text-sm text-[#c78219]">{title}</label>
            <Dropdown
                inputId="dd-city"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                options={data}
                optionLabel="name"
                className="w-full"
                checkmark={true}
                highlightOnSelect={false}
                showClear
            />
        </div>
    );
};
