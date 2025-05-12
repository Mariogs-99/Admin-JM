import { GetProp, Image, message, Upload, UploadFile, UploadProps } from "antd";
import { GrAdd } from "react-icons/gr";
import { useEffect, useState } from "react";
import "./galleryCustomStyle.css";
import { deleteGalleryImage, getGalleryByCategory, uploadImage } from "./services/galleryServices";
import { UploadFileStatus } from "antd/es/upload/interface";
import { Bounce, toast } from "react-toastify";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export const GalleryComponent = ({idCategory}:{idCategory:string}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-2',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-3',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-4',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-5',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-6',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-7',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
    ]);

    useEffect(() => {
        fetchGallery()
    }, [])

    const fetchGallery = async () => {
        const response = await getGalleryByCategory(idCategory);
        // Mapea la respuesta de la API al formato de UploadFile[]
       const formattedImages: UploadFile[] = response.map((img) => ({
            uid: `${img.galleryId}`,
            name: img.nameImg,
            status: "done" as UploadFileStatus,
            url: `http://localhost:8080/uploads/${img.path}`, // ✅ corregido
        }));    


        setFileList(formattedImages);
    };

    const handleUpload = async (options: any) => {
        const { file, onSuccess, onError } = options;

        // Crear FormData
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", file.name);
        formData.append("categoryId", idCategory);

        try {

            const response = await uploadImage(formData);
            toast.success('Imagen añadida correctamente', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            onSuccess(response);
        } catch (error) {
            console.error("Upload error:", error);
            onError(error); // Notificar a Ant Design del error
        }
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = (info) => {
        setFileList(info.fileList);
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button" className="flex flex-col">
            <GrAdd className="self-center" size={25} />
            <div style={{ marginTop: 8, }}>Upload</div>
        </button>
    );

    const beforeUpload = (file: File) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error("Solo se permiten archivos de imagen.");
        }
        return isImage; // Retorna `false` para rechazar archivos no válidos
    };

    const deleteImage = async (file: any) => {
        try {
            await deleteGalleryImage(file.uid)

            toast.success('Imagen eliminada correctamente', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });

        } catch (error) {
            toast.error('Error al eliminar imagen', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    }

    return (
        <>
            <Upload
                customRequest={handleUpload}
                accept="image/*"
                beforeUpload={beforeUpload}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                onRemove={deleteImage}
            >
                {uploadButton}
            </Upload>
            {previewImage && (
                <Image
                    className="w-full h-full [&>img]:w-full [&>img]:h-full [&>img]:object-cover pb-1 md:pb-0"
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}

                />
            )}
        </>
    )
}