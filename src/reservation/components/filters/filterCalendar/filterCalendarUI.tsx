
import { JSX, useState } from "react";
import { Calendar } from 'primereact/calendar';
import { Nullable } from "primereact/ts-helpers";
import "./CalendarCustomStyle.css"

export const FilterCalendarUI = ({
    title,
    filterKey,
    onFilterChange
}: {
    title: JSX.Element;
    filterKey: string;
    onFilterChange: (key: string, value: Date | null) => void;
}) => {
    const [date, setDate] = useState<Nullable<Date>>(null);

    const handleDateChange = (e: any) => {
        const newDate = e.value || null;
        setDate(newDate);
        onFilterChange(filterKey, newDate);
    };

    return (
        <div className="flex flex-col gap-1 w-full">
            <label htmlFor="c-date" className="text-sm text-[#c78219]">{title}</label>
            <Calendar
                inputId="c-date"
                value={date}
                placeholder="dd/mm/yyyy"
                onChange={handleDateChange}
                dateFormat="dd/mm/yy"
                showButtonBar
            />
        </div>
    );
};
