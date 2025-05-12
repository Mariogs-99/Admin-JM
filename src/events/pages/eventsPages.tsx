import { useEffect, useState } from "react";
import { Title } from "../../shared/text/title";
import { DescriptionForm } from "../components/descriptionForm";
import eventList from "../Data/eventsList.json"
import { GenericCard } from "../../shared/cards/genericCard";
import { SectionInterface } from "../../shared/interface/sectionInterface";
import { GetEvents } from "../services/eventServices";

function EventPage() {
    const [events, setEvents] = useState<SectionInterface[]>([])
    
        useEffect(() => {
            fetchevents()
        }, []);
    
        const fetchevents = async () => {
            try {
                const response = await GetEvents()
                setEvents(response)
                console.log(response)
            }
            catch (error) {
                console.log(error)
            }
        }

    return (
        <>
            <span className="flex flex-col gap-7">
                <span>
                    <Title>Eventos</Title>
                    
                    
                </span>
                <DescriptionForm />
            </span>

            <h1 className="pt-10 pb-3 font-semibold text-lg">Secciones</h1>
            <div className="flex flex-col gap-7">
                {
                    events.map((event) => (
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

export default EventPage;