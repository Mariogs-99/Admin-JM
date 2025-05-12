import { SaveButton } from "../../shared/buttons/saveButton";
import categoryList from "../data/categoryList.json"
import { Title } from "../../shared/text/title"
import { useState } from "react";
import { CategoryForm } from "../components/categoryForm";
import { CategoryCard } from "../components/categoryCard";

export const CategoryPage = () => {

    return (
        <>
            <span className="flex justify-between">
                <Title>Tipos de habitación</Title>
                <SaveButton>Guardar</SaveButton>
            </span>

            <div>
                <CategoryForm />
            </div>
            <div>
                <h2 className="font-semibold text-lg">Lista de categorias</h2>
                <span className="h-full flex flex-col justify-center pt-1 pb-5">
                    <hr className="opacity-20"/>
                </span>
                <span className="grid grid-cols-2 gap-7">
                    {
                        categoryList.map((category) => (
                            <CategoryCard category={category.category} description={category.description} />
                        ))
                    }
                </span>
            </div>

        </>

    )
}