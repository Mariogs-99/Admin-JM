import { FC, HTMLProps, useState } from "react"
import { Title } from "../text/title"

interface GenericCardInterface {
    title: string,
    description: string,
    img: string,
    className?: HTMLProps<HTMLElement>['className']
}

export const GenericCard: FC<GenericCardInterface> = ({ title, description, img ="", className }) => {
    return (
        <article className="grid grid-cols-[20%_80%] leading-7 border border-border p-7 rounded-sm">
            <div className="overflow-hidden w-40 h-40 md:w-52 md:h-52 rounded-md">
                <img
                    src={img}
                    alt=""
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="pt-5 md:px-20 flex flex-col justify-center">
                <h2 className="font-semibold text-2xl pb-5">{title}</h2>
                <p>{description}</p>
            </div>
        </article>

    )
}