import { Title } from "../../shared/text/title";
import { RoomForm } from "../components/roomForm"

export const RoomFormPage = () => {
    return (
        <>
            <span >
                <Title className="text-center">Nueva habitación</Title>
                <h2 className="opacity-75 text-center">Información basica</h2>
            </span>
            <RoomForm />
        </>
    )
}