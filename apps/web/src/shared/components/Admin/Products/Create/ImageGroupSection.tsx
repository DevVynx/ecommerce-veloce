import { useFormContext } from "react-hook-form";

import { Field, FieldContent, FieldLabel } from "@/shared/components/shadcn-ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn-ui/select";
import type { CreateProductFormData } from "@/shared/schemas/createProduct";

import { ImageUploadBlock, type StoredImage } from "./ImageUploadBlock";

type ImageGroupSectionProps = {
  imageOptionIndex: number | null;
  onImageOptionIndexChange: (index: number | null) => void;
  onImagesChange: (value: string, images: StoredImage[]) => void;
  onGeneralImagesChange: (images: StoredImage[]) => void;
};

export function ImageGroupSection({
  imageOptionIndex,
  onImageOptionIndexChange,
  onImagesChange,
  onGeneralImagesChange,
}: ImageGroupSectionProps) {
  const { watch } = useFormContext<CreateProductFormData>();
  const options = watch("options");

  const isGeneral = imageOptionIndex === null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Imagens</h2>

      {options.length > 0 && (
        <Field>
          <FieldLabel>Imagens por variação</FieldLabel>
          <FieldContent>
            <Select
              value={imageOptionIndex !== null ? String(imageOptionIndex) : "__none__"}
              onValueChange={(v) => onImageOptionIndexChange(v === "__none__" ? null : Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Nenhuma (mesmas imagens para todas)</SelectItem>
                {options.map((opt, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {opt.name || `Opção ${idx + 1}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>
      )}

      {isGeneral ? (
        <ImageUploadBlock label="Imagens do Produto" onImagesChange={onGeneralImagesChange} />
      ) : (
        options[imageOptionIndex!] && (
          <div className="space-y-6">
            {options[imageOptionIndex!]!.values.map((value) => (
              <ImageUploadBlock
                key={value}
                label={value}
                onImagesChange={(images) => onImagesChange(value, images)}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
