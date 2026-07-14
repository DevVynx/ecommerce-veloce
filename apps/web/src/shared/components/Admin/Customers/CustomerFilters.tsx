import { Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn-ui/select";

export const sortValues = [
  "name_asc",
  "name_desc",
  "recent",
  "oldest",
  "most_orders",
  "most_spent",
] as const;

const sortLabels: Record<(typeof sortValues)[number], string> = {
  name_asc: "Nome A-Z",
  name_desc: "Nome Z-A",
  recent: "Mais recentes",
  oldest: "Mais antigos",
  most_orders: "Mais pedidos",
  most_spent: "Mais gasto",
};

export type CustomerFiltersValue = {
  q: string | null;
  sortBy: (typeof sortValues)[number];
};

type CustomerFiltersProps = {
  values: CustomerFiltersValue;
  onChange: (updates: Partial<CustomerFiltersValue>) => void;
};

export function CustomerFilters({ values, onChange }: CustomerFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <input
          placeholder="Buscar por nome ou email"
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
          value={values.sortBy}
          onValueChange={(v) => onChange({ sortBy: v as CustomerFiltersValue["sortBy"] })}
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
