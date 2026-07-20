import { AlertCircleIcon, Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { CurrencyInput } from "@/shared/components/currency-input";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Input } from "@/shared/components/shadcn-ui/input";
import { Switch } from "@/shared/components/shadcn-ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/shadcn-ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/shadcn-ui/tooltip";
import type { CreateProductFormData } from "@/shared/schemas/createProduct";
import { cn } from "@/shared/utils/lib/utils";
import { generateSku } from "@/shared/utils/store/skuGenerator";

type VariantMatrixProps = {
  optionsRevision: number;
};

export function VariantMatrix({ optionsRevision }: VariantMatrixProps) {
  const {
    control,
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useFormContext<CreateProductFormData>();

  const options = watch("options");
  const variants = watch("variants");

  useEffect(() => {
    const currentOptions = getValues("options");
    const currentName = getValues("name");
    const basePrice = getValues("basePrice");
    const baseStock = getValues("baseStock");
    const baseWeight = getValues("baseWeight");

    if (
      currentOptions.length === 0 ||
      currentOptions.some((option) => !option.name || option.values.length === 0)
    ) {
      setValue("variants", []);
      return;
    }

    const combinations = currentOptions.reduce<Record<string, string>[]>(
      (acc, option) =>
        acc.flatMap((value) => option.values.map((v) => ({ ...value, [option.name]: v }))),
      [{}]
    );

    const existing = new Map(
      getValues("variants").map((variant) => [JSON.stringify(variant.attributes), variant])
    );

    const next = combinations.map((attributes) => {
      const key = JSON.stringify(attributes);
      const prev = existing.get(key);
      return {
        sku: generateSku(currentName || "PROD", attributes),
        price: prev?.price ?? basePrice ?? 0,
        stock: prev?.stock ?? baseStock ?? 0,
        weight: prev?.weight ?? baseWeight ?? 0.1,
        isActive: prev?.isActive ?? true,
        attributes,
      };
    });

    setValue("variants", next);
  }, [optionsRevision, setValue, getValues]);

  const optionsAreIncomplete =
    options.length === 0 || options.some((option) => !option.name || option.values.length === 0);

  if (optionsAreIncomplete) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Variantes</h2>
        <p className="text-muted-foreground text-sm">
          Adicione opções acima para gerar as combinações de variantes.
        </p>
      </div>
    );
  }

  const optionNames = options.map((option) => option.name).filter(Boolean);

  const removeVariant = (index: number) => {
    setValue(
      "variants",
      variants.filter((_, i) => i !== index)
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          Variantes ({variants.length} combinação{variants.length !== 1 ? "ões" : ""})
        </h2>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {optionNames.map((name) => (
                  <TableHead key={name}>{name}</TableHead>
                ))}
                <TableHead className="min-w-35">SKU</TableHead>
                <TableHead className="min-w-25">Preço</TableHead>
                <TableHead className="min-w-20">Estoque</TableHead>
                <TableHead className="min-w-16">Peso(kg)</TableHead>
                <TableHead className="w-16">Ativo</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map((variant, index) => (
                <TableRow key={JSON.stringify(variant.attributes)}>
                  {optionNames.map((name) => (
                    <TableCell key={name} className="text-sm">
                      {variant.attributes[name] ?? "—"}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Input
                        className={cn(
                          "h-8 text-xs",
                          errors.variants?.[index]?.sku && "border-destructive"
                        )}
                        {...register(`variants.${index}.sku`)}
                      />
                      {errors.variants?.[index]?.sku && (
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <button type="button" className="text-destructive shrink-0">
                              <AlertCircleIcon className="size-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="text-destructive">
                            <p>{errors.variants[index]!.sku!.message}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Controller
                        control={control}
                        name={`variants.${index}.price`}
                        render={({ field }) => (
                          <CurrencyInput
                            className={cn(
                              "h-8 text-xs",
                              errors.variants?.[index]?.price && "border-destructive"
                            )}
                            value={field.value as number | null | undefined}
                            onChange={(v) => field.onChange(v)}
                            placeholder="0,00"
                          />
                        )}
                      />
                      {errors.variants?.[index]?.price && (
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <button type="button" className="text-destructive shrink-0">
                              <AlertCircleIcon className="size-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="text-destructive">
                            <p>{errors.variants[index]!.price!.message}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Input
                        className={cn(
                          "h-8 w-20 text-xs",
                          errors.variants?.[index]?.stock && "border-destructive"
                        )}
                        inputMode="numeric"
                        placeholder="0"
                        {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                      />
                      {errors.variants?.[index]?.stock && (
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <button type="button" className="text-destructive shrink-0">
                              <AlertCircleIcon className="size-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="text-destructive">
                            <p>{errors.variants[index]!.stock!.message}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Input
                        className={cn(
                          "h-8 w-15 text-xs",
                          errors.variants?.[index]?.weight && "border-destructive"
                        )}
                        inputMode="decimal"
                        placeholder="0,00"
                        {...register(`variants.${index}.weight`, { valueAsNumber: true })}
                      />
                      {errors.variants?.[index]?.weight && (
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <button type="button" className="text-destructive shrink-0">
                              <AlertCircleIcon className="size-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="text-destructive">
                            <p>{errors.variants[index]!.weight!.message}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex h-8 items-center">
                      <Switch
                        checked={watch(`variants.${index}.isActive`)}
                        onCheckedChange={(v) => setValue(`variants.${index}.isActive`, v)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground size-8"
                      onClick={() => removeVariant(index)}
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}
