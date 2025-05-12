import { FC, HTMLProps } from "react"

interface SaveButton {
    children: string,
    className?: HTMLProps<HTMLElement>["className"] ,
}

export const SaveButton:FC<SaveButton> = ({children, className}) => {
    return(
        <button className={`px-6 py-2 bg-blue-500 text-white rounded-sm self-start text-sm ${className}`}>{ children }</button>
    )
}