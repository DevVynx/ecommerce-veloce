import { useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { ArrowDownToLineIcon } from "@/shared/assets/animatedIcons/arrow-down-to-line";
import { CurrencyInput } from "@/shared/components/currency-input";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Field, FieldContent, FieldLabel } from "@/shared/components/shadcn-ui/field";
import { Input } from "@/shared/components/shadcn-ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/shadcn-ui/tooltip";
import { showNotification } from "@/shared/components/showNotification";
import type { CreateProductFormData } from "@/shared/schemas/createProduct";
import { formatPrice } from "@/shared/utils/store/price";

export function BaseValuesSection() {
  const { control, register, getValues, setValue, clearErrors, watch } = useFormContext<CreateProductFormData>();
  const variants = watch("variants");
  const basePrice = watch("basePrice");
  const baseStock = watch("baseStock");
  const baseWeight = watch("baseWeight");

  const applyBasePrice = useCallback(() => {
    const price = getValues("basePrice");
    const total = getValues("variants").length;
    if (price == null) return;
    setValue(
      "variants",
      getValues("variants").map((v) => ({ ...v, price }))
    );
    clearErrors("variants");
    showNotification({
      type: "success",
      title: "Preço atualizado",
      message: `Preço base de ${formatPrice(Number(price))} aplicado a ${total} variante${total !== 1 ? "s" : ""}.`,
    });
  }, [getValues, setValue, clearErrors]);

  const applyBaseStock = useCallback(() => {
    const stock = getValues("baseStock");
    const total = getValues("variants").length;
    if (stock == null) return;
    setValue(
      "variants",
      getValues("variants").map((v) => ({ ...v, stock }))
    );
    clearErrors("variants");
    showNotification({
      type: "success",
      title: "Estoque atualizado",
      message: `Estoque base de ${stock} aplicado a ${total} variante${total !== 1 ? "s" : ""}.`,
    });
  }, [getValues, setValue, clearErrors]);

  const applyBaseWeight = useCallback(() => {
    const weight = getValues("baseWeight");
    const total = getValues("variants").length;
    if (weight == null) return;
    setValue(
      "variants",
      getValues("variants").map((v) => ({ ...v, weight }))
    );
    clearErrors("variants");
    showNotification({
      type: "success",
      title: "Peso atualizado",
      message: `Peso base de ${weight}kg aplicado a ${total} variante${total !== 1 ? "s" : ""}.`,
    });
  }, [getValues, setValue, clearErrors]);

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Valores Base (opcional)</h2>
        <p className="text-muted-foreground text-sm">
          Valores base (opcional). Preencha para aplicar automaticamente nas novas variantes.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel>Preço base</FieldLabel>
            <FieldContent>
              <div className="flex items-center gap-2">
                <div
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                >
                  <Controller
                    control={control}
                    name="basePrice"
                    render={({ field }) => (
                      <CurrencyInput
                        value={field.value as number | null | undefined}
                        onChange={(v) => field.onChange(v ?? undefined)}
                        placeholder="0,00"
                      />
                    )}
                  />
                </div>
                <Tooltip delayDuration={450}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-7 shrink-0"
                      disabled={basePrice == null || !variants.length}
                      onClick={applyBasePrice}
                    >
                      <ArrowDownToLineIcon size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Aplicar este preço a todas as variantes
                  </TooltipContent>
                </Tooltip>
              </div>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Estoque base</FieldLabel>
            <FieldContent>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  {...register("baseStock", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                />
                <Tooltip delayDuration={450}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-7 shrink-0"
                      disabled={baseStock == null || !variants.length}
                      onClick={applyBaseStock}
                    >
                      <ArrowDownToLineIcon size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Aplicar este estoque a todas as variantes
                  </TooltipContent>
                </Tooltip>
              </div>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Peso base(kg)</FieldLabel>
            <FieldContent>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="any"
                  inputMode="decimal"
                  placeholder="0,00"
                  {...register("baseWeight", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                />
                <Tooltip delayDuration={450}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-7 shrink-0"
                      disabled={baseWeight == null || !variants.length}
                      onClick={applyBaseWeight}
                    >
                      <ArrowDownToLineIcon size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Aplicar este peso a todas as variantes
                  </TooltipContent>
                </Tooltip>
              </div>
            </FieldContent>
          </Field>
        </div>
      </div>
    </TooltipProvider>
  );
}
