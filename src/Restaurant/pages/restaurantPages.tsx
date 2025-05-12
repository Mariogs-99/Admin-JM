import { GalleryComponent } from "../../shared/gallery/galleryComponent";
import { Title } from "../../shared/text/title";
import { RestaurantSectionForm } from "../components/restaurantSectionForm";

function RestaurantPage() {
    return (
        <>
            <Title>Restaurante</Title>
            <RestaurantSectionForm />

            <section className="flex flex-col gap-5">
                <h2>Galeria</h2>
                <GalleryComponent />
            </section>
        </>
    )
}

export default RestaurantPage;