import { useFormContext } from "react-hook-form";

import { Card, CardContent } from "@/shared/components/shadcn-ui/card";
import type { CreateCouponFormData } from "@/shared/schemas/coupons";
import { formatPrice } from "@/shared/utils/store/price";

function formatSummaryDate(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString("pt-BR");
  const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${date} às ${time}`;
}

export function CouponSummaryTicket({ mode = "create" }: { mode?: "create" | "edit" }) {
  const { watch } = useFormContext<CreateCouponFormData>();
  const values = watch();

  const discountLabel =
    values.type === "PERCENTAGE"
      ? `${values.value ?? 0}% de desconto`
      : values.type === "FIXED"
        ? `${formatPrice(values.value ?? 0)} de desconto`
        : "frete grátis";

  const maxStr =
    values.type === "PERCENTAGE" && values.maxDiscount
      ? ` (máx: ${formatPrice(values.maxDiscount)})`
      : "";

  const minOrderStr =
    (values.minOrderValue ?? 0) > 1
      ? ` em compras acima de ${formatPrice(values.minOrderValue!)}`
      : " em qualquer pedido";

  const dateRangeStr =
    values.startsAt && values.endsAt
      ? `\nVálido de ${formatSummaryDate(values.startsAt)} até ${formatSummaryDate(values.endsAt)}.`
      : "";

  const usageLimitStr = values.usageLimit
    ? (values.usageLimitPerUser ?? 0) > 1
      ? `${values.usageLimit} vezes, até ${values.usageLimitPerUser} vezes por cliente`
      : `${values.usageLimit} vezes, ${values.usageLimitPerUser ?? 1} vez por cliente`
    : "---";

  return (
    <Card className="border-dashed">
      <CardContent className="space-y-2 p-4 text-sm">
        <p className="font-semibold">Resumo do Cupom</p>
        <p>
          Código: <span className="font-mono font-medium uppercase">{values.code || "---"}</span>
        </p>
        <p>
          Os clientes ganharão{" "}
          <strong>
            {discountLabel}
            {maxStr}
          </strong>
          {minOrderStr}.
        </p>
        {dateRangeStr && <p className="whitespace-pre-line">{dateRangeStr}</p>}
        <p>
          Poderá ser usado <strong>{values.usageLimit ? usageLimitStr : "---"}</strong>.
        </p>
        {!values.isActive && (
          <p className="text-muted-foreground text-xs">
            {mode === "edit" ? "O cupom está inativo." : "O cupom será criado como inativo."}
          </p>
        )}
        <p className="text-muted-foreground mt-2 border-t pt-2 text-xs italic">
          {mode === "edit"
            ? "Revise os dados antes de salvar."
            : "Verifique com atenção os dados, pois após a criação não será possível alterar a maioria das informações do cupom."}
        </p>
      </CardContent>
    </Card>
  );
}
