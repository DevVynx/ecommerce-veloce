import { CircleAlertIcon, ImageIcon, RefreshCwIcon, XIcon } from "lucide-react";

import { Alert, AlertAction, AlertTitle } from "@/shared/components/shadcn-ui/alert";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Progress } from "@/shared/components/shadcn-ui/progress";
import { formatBytes } from "@/shared/hooks/ui/use-file-upload";

import type { StoredImage } from "./useImageUpload";

type UploadFileItem = {
  id: string;
  file: { name: string; size: number };
  preview?: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
  result?: StoredImage;
};

type ImageUploadItemProps = {
  item: UploadFileItem;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
};

export function ImageUploadItem({ item, onRemove, onRetry }: ImageUploadItemProps) {
  return (
    <div key={item.id} className="border-border bg-card rounded-lg border p-2.5">
      <div className="flex items-center gap-2.5">
        <div className="shrink-0">
          {item.preview ? (
            <img
              src={item.preview}
              alt={item.file.name}
              className="h-12 w-12 rounded-lg border object-cover"
            />
          ) : (
            <div className="border-border text-muted-foreground flex h-12 w-12 items-center justify-center rounded-lg border">
              <ImageIcon className="size-4" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="inline-flex flex-col justify-center gap-1 truncate font-medium">
              <span className="text-sm">{item.file.name}</span>
              <span className="text-muted-foreground text-xs">{formatBytes(item.file.size)}</span>
            </p>
            <Button
              onClick={() => onRemove(item.id)}
              variant="ghost"
              size="icon"
              className="text-muted-foreground size-6"
            >
              <XIcon className="size-4" />
            </Button>
          </div>
          {item.status === "uploading" && (
            <div className="mt-2">
              <Progress value={50} className="h-1" />
            </div>
          )}
          {item.status === "error" && item.error && (
            <Alert variant="destructive" className="mt-2 px-2 py-1">
              <CircleAlertIcon className="size-4" />
              <AlertTitle className="text-xs">{item.error}</AlertTitle>
              <AlertAction>
                <Button
                  onClick={() => onRetry(item.id)}
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground size-6 hover:bg-transparent hover:opacity-100"
                >
                  <RefreshCwIcon className="size-3.5" />
                </Button>
              </AlertAction>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
