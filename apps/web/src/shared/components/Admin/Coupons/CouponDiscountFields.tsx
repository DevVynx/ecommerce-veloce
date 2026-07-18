"use client";

import { Controller, useFormContext } from "react-hook-form";

import { CurrencyInput } from "@/shared/components/currency-input";
import { Field, FieldContent, FieldLabel } from "@/shared/components/shadcn-ui/field";
import { Input } from "@/shared/components/shadcn-ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn-ui/select";
import type { CreateCouponFormData } from "@/shared/schemas/coupons";

export function CouponDiscountFields({ disabled }: { disabled?: boolean }) {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CreateCouponFormData>();

  const type = watch("type");
  const currentValue = watch("value");
  const currentMaxDiscount = watch("maxDiscount");

  return (
    <>
      <Field>
        <FieldLabel>Tipo</FieldLabel>
        <FieldContent>
          <Select
            value={type}
            onValueChange={(v) => {
              setValue("type", v as CreateCouponFormData["type"]);
              if (v === "FREE_SHIPPING") {
                setValue("value", undefined);
                setValue("maxDiscount", null);
              }
            }}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PERCENTAGE">Percentual</SelectItem>
              <SelectItem value="FIXED">Fixo</SelectItem>
              <SelectItem value="FREE_SHIPPING">Frete Grátis</SelectItem>
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      {type !== "FREE_SHIPPING" && (
        <Field>
          <FieldLabel>{type === "PERCENTAGE" ? "Desconto (%)" : "Valor (R$)"}</FieldLabel>
          <FieldContent>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                {type === "PERCENTAGE" ? (
                  <Controller
                    name="value"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="Ex: 15"
                        disabled={disabled}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "");
                          if (!digits) {
                            field.onChange(undefined);
                            return;
                          }
                          field.onChange(Math.min(parseInt(digits, 10), 100));
                        }}
                      />
                    )}
                  />
                ) : (
                  <CurrencyInput
                    value={currentValue}
                    onChange={(v) => setValue("value", v)}
                    placeholder="Ex: 50,00"
                    disabled={disabled}
                  />
                )}
                {errors.value && (
                  <p className="text-destructive mt-1 text-xs">{errors.value.message}</p>
                )}
              </div>
              {type === "PERCENTAGE" && (
                <div className="flex-1">
                  <CurrencyInput
                    value={currentMaxDiscount}
                    onChange={(v) => setValue("maxDiscount", v ?? null)}
                    placeholder="Desconto máx (R$)"
                    disabled={disabled}
                  />
                  {errors.maxDiscount && (
                    <p className="text-destructive mt-1 text-xs">{errors.maxDiscount.message}</p>
                  )}
                </div>
              )}
            </div>
          </FieldContent>
        </Field>
      )}
    </>
  );
}
