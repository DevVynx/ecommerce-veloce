import { Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn-ui/select";

export const sortValues = ["newest", "oldest"] as const;

const sortLabels: Record<(typeof sortValues)[number], string> = {
  newest: "Mais recentes",
  oldest: "Mais antigos",
};

const statusOptions = [
  { value: "PENDING", label: "Pendente" },
  { value: "PAID", label: "Pago" },
  { value: "PROCESSING", label: "Processando" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELED", label: "Cancelado" },
  { value: "REFUNDED", label: "Reembolsado" },
] as const;

export type OrderFiltersValue = {
  q: string | null;
  status: string | null;
  sort: (typeof sortValues)[number];
};

type OrderFiltersProps = {
  values: OrderFiltersValue;
  onChange: (updates: Partial<OrderFiltersValue>) => void;
};

export function OrderFilters({ values, onChange }: OrderFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <input
          placeholder="Buscar por nº do pedido ou cliente"
          defaultValue={values.q ?? ""}
          onBlur={(e) => onChange({ q: e.target.value || null })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onChange({ q: (e.target as HTMLInputElement).value || null });
            }
          }}
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-lg border pr-4 pl-10 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Select
          value={values.status ?? ""}
          onValueChange={(v) => onChange({ status: v !== "__all__" ? v : null })}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todos os status</SelectItem>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={values.sort}
          onValueChange={(v) => onChange({ sort: v as OrderFiltersValue["sort"] })}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            {sortValues.map((v) => (
              <SelectItem key={v} value={v}>
                {sortLabels[v]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
