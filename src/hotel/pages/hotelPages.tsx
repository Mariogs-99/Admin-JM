import { Title } from "../../shared/text/title";
import { GalleryComponent } from "../../shared/gallery/galleryComponent";
import { ContactForm } from "../../Contact/components/contactForm";
import { TabView, TabPanel } from 'primereact/tabview';
import "primereact/resources/themes/saga-blue/theme.css";

function HotelPages() {
    return (

        <TabView>
            <TabPanel header="Contactos">
                <section className="rounded-md ">
                    <Title className="mb-5">Contactos</Title>
                    <ContactForm />
                </section>
            </TabPanel>
            <TabPanel header="Galeria">
                <section className="rounded-md">
                    <Title className="mb-5">Galeria</Title>
                    <GalleryComponent /> {/*categoria id = 1 -> hotel */}
                </section>
            </TabPanel>
        </TabView>
    )
}

export default HotelPages;