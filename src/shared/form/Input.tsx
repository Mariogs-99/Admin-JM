import React from "react";

interface TextInputProps {
    name: string,
    placeholder?: string,
    type?: "text" | "number" | "email" | "password" | "date" | "file",
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    className?: string,
}

const TextInput: React.FC<TextInputProps> = ({ name, placeholder = "", type, value, onChange, className = "" }) => {
    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`border border-border focus:outline-1 focus:outline-border rounded-sm px-3 py-2 ${className}`}
        />
    );
};

export default TextInput;
