import imageCompression from "browser-image-compression";
import { useCallback, useState } from "react";

import { deleteImageFile } from "@/shared/actions/products/deleteImageFile";
import { uploadImage } from "@/shared/actions/products/uploadImage";
import { showNotification } from "@/shared/components/showNotification";
import { type FileWithPreview, useFileUpload } from "@/shared/hooks/ui/use-file-upload";

export type StoredImage = { id: string; url: string; publicId: string };

type Status = "uploading" | "completed" | "error";

type UploadFileItem = FileWithPreview & {
  progress: number;
  status: Status;
  error?: string;
  result?: StoredImage;
};

async function compressAndUpload(file: File): Promise<{ url: string; publicId: string }> {
  const compressed = await imageCompression(file, {
    maxWidthOrHeight: 1500,
    maxSizeMB: 0.8,
    useWebWorker: true,
  });

  const formData = new FormData();
  formData.append("file", compressed, file.name);

  const { data, error } = await uploadImage(formData);
  if (error) throw new Error(error.message);

  return { url: data!.url, publicId: data!.publicId };
}

async function processFile(
  fileId: string,
  file: File,
  setUploadFiles: React.Dispatch<React.SetStateAction<UploadFileItem[]>>
): Promise<StoredImage | null> {
  try {
    const { url, publicId } = await compressAndUpload(file);
    const storedImage: StoredImage = { id: fileId, url, publicId };
    setUploadFiles((prev) =>
      prev.map((currentFile) =>
        currentFile.id === fileId
          ? { ...currentFile, progress: 100, status: "completed" as Status, result: storedImage }
          : currentFile
      )
    );
    return storedImage;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao processar imagem";
    setUploadFiles((prev) =>
      prev.map((currentFile) =>
        currentFile.id === fileId
          ? { ...currentFile, status: "error" as Status, error: message }
          : currentFile
      )
    );
    return null;
  }
}

type UseImageUploadOptions = {
  onImagesChange: (images: StoredImage[]) => void;
};

export function useImageUpload({ onImagesChange }: UseImageUploadOptions) {
  const [uploadFiles, setUploadFiles] = useState<UploadFileItem[]>([]);

  const [
    { isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      removeFile,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024,
    accept: "image/jpeg,image/png,image/webp,image/gif,image/avif",
    multiple: true,
    onFilesAdded: async (added) => {
      const initialItems: UploadFileItem[] = added.map((file) => ({
        ...file,
        progress: 0,
        status: "uploading" as Status,
      }));
      setUploadFiles((prev) => [...prev, ...initialItems]);

      const results: StoredImage[] = [];

      for (const file of added) {
        const result = await processFile(file.id, file.file as File, setUploadFiles);
        if (result) results.push(result);
      }

      if (results.length > 0) onImagesChange(results);
    },
  });

  const retryUpload = useCallback(
    async (fileId: string) => {
      const item = uploadFiles.find((currentFile) => currentFile.id === fileId);
      if (!item) return;

      setUploadFiles((prev) =>
        prev.map((currentFile) =>
          currentFile.id === fileId
            ? { ...currentFile, progress: 0, status: "uploading" as Status, error: undefined }
            : currentFile
        )
      );

      const result = await processFile(fileId, item.file as File, setUploadFiles);
      if (result) onImagesChange([result]);
    },
    [uploadFiles, onImagesChange]
  );

  const removeUploadFile = useCallback(
    async (fileId: string) => {
      const item = uploadFiles.find((currentFile) => currentFile.id === fileId);
      const storedImage = item?.result;

      if (storedImage?.publicId) {
        const { error } = await deleteImageFile(storedImage.publicId);
        if (error) {
          showNotification({
            type: "error",
            title: "Erro ao remover imagem",
            message: error.message,
          });
          return;
        }
      }

      removeFile(fileId);
      setUploadFiles((prev) => prev.filter((currentFile) => currentFile.id !== fileId));
    },
    [uploadFiles, removeFile]
  );

  const completedCount = uploadFiles.filter((file) => file.status === "completed").length;
  const errorCount = uploadFiles.filter((file) => file.status === "error").length;
  const uploadingCount = uploadFiles.filter((file) => file.status === "uploading").length;

  return {
    uploadFiles,
    isDragging,
    errors,
    completedCount,
    errorCount,
    uploadingCount,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    openFileDialog,
    getInputProps,
    retryUpload,
    removeUploadFile,
  };
}
