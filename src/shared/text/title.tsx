import { FC, HTMLProps } from "react";

interface titleInterface{
    className?: HTMLProps<HTMLElement>["className"] 
    children:string;
}

export const Title:FC<titleInterface> = ({className, children}) => {
    return(
        <h1 className = {`text-4xl text-start font-bold text-title ${className}`}>
            {children}
        </h1>
    )
}