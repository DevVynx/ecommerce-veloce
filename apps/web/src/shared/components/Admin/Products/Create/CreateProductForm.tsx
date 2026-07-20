import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { createProduct } from "@/shared/actions/products/createProduct";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Separator } from "@/shared/components/shadcn-ui/separator";
import { showNotification } from "@/shared/components/showNotification";
import { type CreateProductFormData, createProductSchema } from "@/shared/schemas/createProduct";

import { BaseValuesSection } from "./BaseValuesSection";
import { BasicInfoSection } from "./BasicInfoSection";
import { ImageGroupSection } from "./ImageGroupSection";
import type { StoredImage } from "./ImageUploadBlock";
import { OptionsBuilder } from "./OptionsBuilder";
import { VariantMatrix } from "./VariantMatrix";

type CreateProductFormProps = {
  categories: { id: string; name: string }[];
  onSuccess?: () => void;
};

export function CreateProductForm({ categories, onSuccess }: CreateProductFormProps) {
  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      basePrice: undefined,
      baseStock: undefined,
      baseWeight: undefined,
      options: [],
      variants: [],
    },
  });

  const options = form.watch("options");

  const [optionsRevision, setOptionsRevision] = useState(0);
  const handleOptionsChange = useCallback(() => setOptionsRevision((r) => r + 1), []);

  const [imageOptionIndex, setImageOptionIndex] = useState<number | null>(null);
  const [imageMap, setImageMap] = useState<Record<string, StoredImage[]>>({});
  const [generalImages, setGeneralImages] = useState<StoredImage[]>([]);

  const handleImagesChange = useCallback((value: string, images: StoredImage[]) => {
    setImageMap((prev) => ({
      ...prev,
      [value]: [...(prev[value] ?? []), ...images],
    }));
  }, []);

  const handleGeneralImagesChange = useCallback((images: StoredImage[]) => {
    setGeneralImages((prev) => [...prev, ...images]);
  }, []);

  const onSubmit = async (data: CreateProductFormData) => {
    const valid = await form.trigger();
    if (!valid) return;

    const imageOptionName = imageOptionIndex !== null ? options[imageOptionIndex]?.name : undefined;

    if (imageOptionName) {
      const missingImages = options[imageOptionIndex!]!.values.filter(
        (v) => !imageMap[v] || imageMap[v]!.length === 0
      );
      if (missingImages.length > 0) {
        showNotification({
          type: "error",
          title: "Imagens necessárias",
          message: `As variantes de "${missingImages.join(", ")}" precisam de pelo menos uma imagem.`,
        });
        return;
      }
    } else if (generalImages.length === 0) {
      showNotification({
        type: "error",
        title: "Imagens necessárias",
        message: "Adicione ao menos uma imagem ao produto.",
      });
      return;
    }

    const payload = {
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      options: data.options,
      variants: data.variants.map((v) => ({
        sku: v.sku,
        price: Number(v.price),
        stock: Number(v.stock),
        weight: Number(v.weight),
        isActive: v.isActive ?? true,
        attributes: v.attributes,
        images: imageOptionName
          ? v.attributes[imageOptionName] && imageMap[v.attributes[imageOptionName]!]
            ? imageMap[v.attributes[imageOptionName]!]!.map((img) => ({
                url: img.url,
                publicId: img.publicId,
              }))
            : []
          : generalImages.map((img) => ({ url: img.url, publicId: img.publicId })),
      })),
    };

    const noImageVariants = payload.variants.filter((v) => v.images.length === 0);
    if (noImageVariants.length > 0) {
      showNotification({
        type: "error",
        title: "Imagens necessárias",
        message:
          "Todas as variantes precisam de pelo menos uma imagem. Selecione uma opção de imagem e faça upload.",
      });
      return;
    }

    const result = await createProduct(payload);

    if (result.error) {
      showNotification({
        type: "error",
        title: "Erro ao criar produto",
        message: result.error.message,
      });
      return;
    }

    showNotification({
      type: "success",
      title: "Produto criado",
      message: `O produto "${data.name}" foi criado com ${payload.variants.length} variante${payload.variants.length !== 1 ? "s" : ""}.`,
    });
    onSuccess?.();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <BasicInfoSection categories={categories} />

        <Separator />

        <BaseValuesSection />

        <Separator />

        <OptionsBuilder onOptionsChange={handleOptionsChange} />

        <Separator />

        <ImageGroupSection
          imageOptionIndex={imageOptionIndex}
          onImageOptionIndexChange={setImageOptionIndex}
          onImagesChange={handleImagesChange}
          onGeneralImagesChange={handleGeneralImagesChange}
        />

        <Separator />

        <VariantMatrix optionsRevision={optionsRevision} />

        <Button
          type="submit"
          className="w-full py-4"
          disabled={form.watch("variants").length === 0}
        >
          Criar Produto
        </Button>
      </form>
    </FormProvider>
  );
}
