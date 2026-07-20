import type { CategoryDto } from "@repo/types/contracts";
import { useFormContext } from "react-hook-form";

import { Field, FieldContent, FieldLabel } from "@/shared/components/shadcn-ui/field";
import { Input } from "@/shared/components/shadcn-ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn-ui/select";
import { Textarea } from "@/shared/components/shadcn-ui/textarea";
import type { CreateProductFormData } from "@/shared/schemas/createProduct";

type BasicInfoSectionProps = {
  categories: CategoryDto[];
};

export function BasicInfoSection({ categories }: BasicInfoSectionProps) {
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
  } = useFormContext<CreateProductFormData>();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Informações Básicas</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Nome</FieldLabel>
          <FieldContent>
            <Input
              placeholder="Ex: Camiseta Algodão Premium"
              maxLength={200}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              {...register("name")}
            />
            {errors.name && <p className="text-destructive mt-1 text-xs">{errors.name.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Categoria</FieldLabel>
          <FieldContent>
            <Select value={watch("categoryId")} onValueChange={(v) => { setValue("categoryId", v); clearErrors("categoryId"); }}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-destructive mt-1 text-xs">{errors.categoryId.message}</p>
            )}
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel>Descrição</FieldLabel>
        <FieldContent>
          <Textarea
            placeholder="Descrição detalhada do produto..."
            className="min-h-25 resize-none"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-destructive mt-1 text-xs">{errors.description.message}</p>
          )}
        </FieldContent>
      </Field>
    </div>
  );
}
