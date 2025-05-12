import { useEffect, useState } from "react";
import { Title } from "../../shared/text/title";
import { ExperienceSectionForm } from "../components/experienceSectionForm";
import { GenericCard } from "../../shared/cards/genericCard";
import { GetExperiences } from "../services/experiencesServices";
import { SectionInterface } from "../../shared/interface/sectionInterface";

function ExperiencesPage() {
    const [experiences, setExperiences] = useState<SectionInterface[]>([])

    useEffect(() => {
        fetchExperiences()
    }, []);

    const fetchExperiences = async () => {
        try {
            const response = await GetExperiences()
            setExperiences(response)
            console.log(response)
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <span className="flex flex-col gap-7">
                <Title>Experiencias</Title>
                <ExperienceSectionForm />
            </span>

            <h1 className="pt-10 pb-3 font-semibold text-lg">Secciones</h1>
            <div className="flex flex-col gap-7">
                {
                    experiences.map((event) => (
                        <GenericCard
                            key={event.title}
                            title={event.title}
                            description={event.description}
                            img={""}
                        />
                    ))
                }
            </div>

        </>
    )
}

export default ExperiencesPage
    ;