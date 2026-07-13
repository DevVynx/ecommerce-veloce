import { Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn-ui/select";

export const sortValues = ["newest", "oldest", "expiring_soon", "usage_desc", "usage_asc"] as const;

const sortLabels: Record<(typeof sortValues)[number], string> = {
  newest: "Mais recentes",
  oldest: "Mais antigos",
  expiring_soon: "Próximos do vencimento",
  usage_desc: "Mais usados",
  usage_asc: "Menos usados",
};

export type CouponFiltersValue = {
  q: string | null;
  status: "active" | "inactive" | null;
  sort: (typeof sortValues)[number];
};

type CouponFiltersProps = {
  values: CouponFiltersValue;
  onChange: (updates: Partial<CouponFiltersValue>) => void;
};

export function CouponFilters({ values, onChange }: CouponFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <input
          placeholder="Buscar por código"
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
          onValueChange={(v) =>
            onChange({ status: v !== "__all__" ? (v as "active" | "inactive") : null })
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todos os status</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={values.sort}
          onValueChange={(v) => onChange({ sort: v as CouponFiltersValue["sort"] })}
        >
          <SelectTrigger className="w-52">
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
