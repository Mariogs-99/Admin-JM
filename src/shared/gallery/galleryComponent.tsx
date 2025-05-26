import { GetProp, Image, Upload, UploadFile, UploadProps, message } from "antd";
import { GrAdd } from "react-icons/gr";
import { useEffect, useState } from "react";
import "./galleryCustomStyle.css";
import { deleteGalleryImage, getAllGalleryImages, uploadImage } from "./services/galleryServices";
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

export const GalleryComponent = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await getAllGalleryImages();
      const formattedImages: UploadFile[] = response.map((img) => ({
        uid: `${img.galleryId}`,
        name: img.title,
        status: "done" as UploadFileStatus,
        url: `${import.meta.env.VITE_BASE_URL}${img.imageUrl}`,
      }));
      setFileList(formattedImages);
    } catch (error) {
      toast.error("Error al cargar la galería");
    }
  };

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;

    const dto = {
      title: file.name,
      description: "Imagen de galería",
      position: 0,
      active: true
    };

    const formData = new FormData();
    formData.append("file", file);
    formData.append("data", new Blob([JSON.stringify(dto)], { type: "application/json" }));

    try {
      const response = await uploadImage(formData);
      toast.success('Imagen añadida correctamente', { transition: Bounce });
      fetchGallery(); // Refrescar lista
      onSuccess(response);
    } catch (error) {
      toast.error("Error al subir la imagen", { transition: Bounce });
      onError(error);
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

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Solo se permiten archivos de imagen.");
    }
    return isImage;
  };

  const deleteImage = async (file: any) => {
    try {
      await deleteGalleryImage(file.uid);
      toast.success('Imagen eliminada correctamente', { transition: Bounce });
      fetchGallery(); // Refrescar
    } catch (error) {
      toast.error('Error al eliminar imagen', { transition: Bounce });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button" className="flex flex-col">
      <GrAdd className="self-center" size={25} />
      <div style={{ marginTop: 8 }}>Subir</div>
    </button>
  );

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
  );
};
