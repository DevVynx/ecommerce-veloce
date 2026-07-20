import { CircleAlertIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/shared/components/shadcn-ui/alert";

import { ImageUploadDropZone } from "./ImageUploadDropZone";
import { ImageUploadItem } from "./ImageUploadItem";
import { type StoredImage, useImageUpload } from "./useImageUpload";

export type { StoredImage };

type ImageUploadBlockProps = {
  label: string;
  onImagesChange: (images: StoredImage[]) => void;
};

export function ImageUploadBlock({ label, onImagesChange }: ImageUploadBlockProps) {
  const {
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
  } = useImageUpload({ onImagesChange });

  return (
    <div>
      <h3 className="mb-2 text-sm font-medium">{label}</h3>

      <ImageUploadDropZone
        isDragging={isDragging}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
        getInputProps={getInputProps}
      />

      <div className="my-2 flex items-center gap-1">
        <span className="text-muted-foreground text-sm font-semibold">Progresso:</span>
        {(completedCount > 0 || errorCount > 0 || uploadingCount > 0) && (
          <div className="flex items-center gap-2">
            {completedCount > 0 && (
              <span className="bg-success/15 border-success text-success rounded-md border px-1 text-xs font-semibold">
                Concluído{completedCount !== 1 ? "s:" : ":"} {completedCount}
              </span>
            )}
            {errorCount > 0 && (
              <span className="bg-destructive/15 border-destructive text-destructive rounded-md border px-1 text-xs font-semibold">
                Falho{errorCount !== 1 ? "s:" : ":"} {errorCount}
              </span>
            )}
            {uploadingCount > 0 && (
              <span className="bg-muted border-muted-foreground text-muted-foreground rounded-md border px-1 text-xs font-semibold">
                Enviando: {uploadingCount}
              </span>
            )}
          </div>
        )}
      </div>

      {uploadFiles.length > 0 && (
        <div className="mb-3 space-y-2">
          {uploadFiles.map((item) => (
            <ImageUploadItem
              key={item.id}
              item={item}
              onRemove={removeUploadFile}
              onRetry={retryUpload}
            />
          ))}
        </div>
      )}

      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-3">
          <CircleAlertIcon />
          <AlertTitle className="text-destructive">Erro no upload</AlertTitle>
          <AlertDescription>
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
