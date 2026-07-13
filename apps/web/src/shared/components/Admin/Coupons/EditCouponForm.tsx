import { zodResolver } from "@hookform/resolvers/zod";
import type { AdminCouponDto, UpdateCouponRequest } from "@repo/types/contracts";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { updateCoupon } from "@/shared/actions/coupons/updateCoupon";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Field, FieldContent, FieldLabel } from "@/shared/components/shadcn-ui/field";
import { Input } from "@/shared/components/shadcn-ui/input";
import { Switch } from "@/shared/components/shadcn-ui/switch";
import { Textarea } from "@/shared/components/shadcn-ui/textarea";
import { showNotification } from "@/shared/components/showNotification";
import { type CreateCouponFormData, createCouponSchema } from "@/shared/schemas/coupons";
import {
  getCurrentSlot,
  getEndsAtConstraints,
  getTodayMidnight,
} from "@/shared/utils/date/dateTimeISO";

import { CouponDiscountFields } from "./CouponDiscountFields";
import { CouponSummaryTicket } from "./CouponSummaryTicket";
import { CurrencyInput } from "./CurrencyInput";
import { DateTimePicker } from "./DateTimePicker";

const DESC_MAX = 50;

type EditCouponFormProps = {
  coupon: AdminCouponDto;
  onSuccess?: () => void;
};

export function EditCouponForm({ coupon, onSuccess }: EditCouponFormProps) {
  const isFrozen = coupon.usageCount > 0;
  const today = useMemo(() => getTodayMidnight(), []);
  const currentSlot = getCurrentSlot();

  const form = useForm<CreateCouponFormData>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      code: coupon.code,
      type: coupon.type,
      description: coupon.description ?? "",
      value: coupon.value,
      maxDiscount: coupon.maxDiscount,
      minOrderValue: coupon.minOrderValue,
      usageLimit: coupon.usageLimit,
      usageLimitPerUser: coupon.usageLimitPerUser,
      startsAt: coupon.startsAt,
      endsAt: coupon.endsAt,
      isActive: coupon.isActive,
    },
  });

  const { errors } = form.formState;

  const startsAt = form.watch("startsAt");
  const {
    disabledBeforeDate: endsAtDisabledBeforeDate,
    disabledBeforeTime: endsAtDisabledBeforeTime,
  } = getEndsAtConstraints(startsAt);

  const descLength = form.watch("description")?.length ?? 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = await form.trigger();
    if (!valid) return;

    const raw = form.getValues();

    let body: UpdateCouponRequest;

    if (isFrozen) {
      body = {
        endsAt: raw.endsAt,
        usageLimit: raw.usageLimit,
        description: raw.description || undefined,
        usageLimitPerUser: raw.usageLimitPerUser,
        isActive: raw.isActive,
      };
    } else {
      body = {
        code: raw.code.toUpperCase(),
        type: raw.type,
        startsAt: raw.startsAt,
        endsAt: raw.endsAt,
        usageLimit: raw.usageLimit,
        description: raw.description || undefined,
        value: raw.type !== "FREE_SHIPPING" ? raw.value : undefined,
        maxDiscount: raw.type === "PERCENTAGE" ? (raw.maxDiscount ?? null) : undefined,
        minOrderValue: raw.minOrderValue,
        usageLimitPerUser: raw.usageLimitPerUser,
        isActive: raw.isActive,
      };
    }

    const result = await updateCoupon(coupon.id, body);

    if (result.error) {
      showNotification({
        type: "error",
        title: "Erro ao editar cupom",
        message: result.error.message,
      });
      return;
    }

    showNotification({
      type: "success",
      title: "Cupom editado",
      message: `Cupom ${raw.code.toUpperCase()} salvo com sucesso.`,
    });
    onSuccess?.();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Field>
          <FieldLabel>Código</FieldLabel>
          <FieldContent>
            <Input
              placeholder="Ex: BELIBELI10"
              maxLength={15}
              className="uppercase"
              disabled={isFrozen}
              {...form.register("code")}
            />
            {errors.code && <p className="text-destructive mt-1 text-xs">{errors.code.message}</p>}
          </FieldContent>
        </Field>

        <CouponDiscountFields disabled={isFrozen} />

        <Field>
          <FieldLabel>Descrição</FieldLabel>
          <FieldContent>
            <Textarea
              placeholder="Descrição opcional do cupom"
              className="resize-none"
              maxLength={DESC_MAX}
              {...form.register("description")}
            />
            <p className="text-muted-foreground mt-1 text-right text-xs tabular-nums">
              {descLength}/{DESC_MAX}
            </p>
          </FieldContent>
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Início</FieldLabel>
            <FieldContent>
              <DateTimePicker
                value={startsAt}
                onChange={(v) => form.setValue("startsAt", v ?? "")}
                minDate={today}
                disabledBeforeTime={currentSlot}
                disabledBeforeDate={new Date()}
                defaultTime={currentSlot}
                placeholder="Data de início"
                disabled={isFrozen}
              />
              {errors.startsAt && (
                <p className="text-destructive mt-1 text-xs">{errors.startsAt.message}</p>
              )}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Fim</FieldLabel>
            <FieldContent>
              <DateTimePicker
                value={form.watch("endsAt")}
                onChange={(v) => form.setValue("endsAt", v ?? "")}
                minDate={endsAtDisabledBeforeDate ? new Date(endsAtDisabledBeforeDate) : today}
                disabledBeforeTime={endsAtDisabledBeforeTime}
                disabledBeforeDate={endsAtDisabledBeforeDate}
                defaultTime="23:30"
                placeholder="Data de fim"
                hideAgora
              />
              {errors.endsAt && (
                <p className="text-destructive mt-1 text-xs">{errors.endsAt.message}</p>
              )}
            </FieldContent>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Usos totais</FieldLabel>
            <FieldContent>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Ex: 100"
                {...form.register("usageLimit", {
                  setValueAs: (v: unknown) => {
                    const digits = String(v ?? "").replace(/\D/g, "");
                    return digits ? parseInt(digits, 10) : undefined;
                  },
                })}
              />
              {errors.usageLimit && (
                <p className="text-destructive mt-1 text-xs">{errors.usageLimit.message}</p>
              )}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Uso por cliente</FieldLabel>
            <FieldContent>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Ex: 1"
                {...form.register("usageLimitPerUser", {
                  setValueAs: (v: unknown) => {
                    const digits = String(v ?? "").replace(/\D/g, "");
                    return digits ? parseInt(digits, 10) : undefined;
                  },
                })}
              />
              {errors.usageLimitPerUser && (
                <p className="text-destructive mt-1 text-xs">{errors.usageLimitPerUser.message}</p>
              )}
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel>Valor mínimo do pedido</FieldLabel>
          <FieldContent>
            <CurrencyInput
              value={form.watch("minOrderValue")}
              onChange={(v) => form.setValue("minOrderValue", v)}
              placeholder="Ex: 150,00"
              disabled={isFrozen}
            />
            {errors.minOrderValue && (
              <p className="text-destructive mt-1 text-xs">{errors.minOrderValue.message}</p>
            )}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Ativo</FieldLabel>
          <FieldContent>
            <div className="flex h-9 items-center">
              <Switch
                checked={form.watch("isActive")}
                onCheckedChange={(v) => form.setValue("isActive", v)}
              />
            </div>
          </FieldContent>
        </Field>

        <CouponSummaryTicket mode="edit" />

        <Button type="submit" className="w-full py-4">
          Salvar
        </Button>
      </form>
    </FormProvider>
  );
}
