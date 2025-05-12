interface Category {
    categoryId: number;
    name: string;
    img: string | null;
}

export interface GalleryItem {
    galleryId: number;
    nameImg: string;
    path: string;
    category: Category;
}