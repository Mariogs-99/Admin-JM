export interface GalleryItem {
  galleryId: number;
  title: string;
  description: string;
  imageUrl: string;     // esto es lo que se guarda como `/uploads/archivo.jpg`
  position: number;
  active: boolean;
  createdAt: string;    // opcional, si quieres mostrar la fecha
}
