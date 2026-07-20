import { XIcon } from "lucide-react";
import { useCallback, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/shared/components/shadcn-ui/button";
import { Field, FieldContent, FieldLabel } from "@/shared/components/shadcn-ui/field";
import { Input } from "@/shared/components/shadcn-ui/input";
import type { CreateProductFormData } from "@/shared/schemas/createProduct";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const capitalizeTrim = (s: string) => capitalize(s.trim());

type OptionsBuilderProps = {
  onOptionsChange?: () => void;
};

export function OptionsBuilder({ onOptionsChange }: OptionsBuilderProps) {
  const {
    control,
    register,
    formState: { errors },
    setValue,
    getValues,
    setError,
    clearErrors,
    watch,
  } = useFormContext<CreateProductFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: "options" });

  const addValue = useCallback(
    (index: number, value: string) => {
      const current = watch(`options.${index}.values`) ?? [];
      const formatted = capitalizeTrim(value);
      if (current.some((v) => v.toLowerCase() === formatted.toLowerCase())) return;
      setValue(`options.${index}.values`, [...current, formatted], { shouldValidate: true });
      onOptionsChange?.();
    },
    [setValue, watch, onOptionsChange]
  );

  const removeValue = useCallback(
    (index: number, valueIndex: number) => {
      const current = watch(`options.${index}.values`) ?? [];
      setValue(
        `options.${index}.values`,
        current.filter((_, i) => i !== valueIndex),
        { shouldValidate: true }
      );
      onOptionsChange?.();
    },
    [setValue, watch, onOptionsChange]
  );

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Opções do Produto</h2>

      {fields.length === 0 && (
        <p className="text-muted-foreground text-sm">Adicione opções como Cor, Tamanho, etc.</p>
      )}

      {fields.map((field, index) => {
        const values = watch(`options.${index}.values`) ?? [];
        return (
          <div key={field.id} className="border-border rounded-lg border p-4">
            <div className="mb-3">
              <Field>
                <FieldLabel>Nome da opção</FieldLabel>
                <div className="flex items-center justify-between gap-4">
                  <FieldContent>
                    <Input
                      placeholder="Ex: Cor"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.preventDefault();
                      }}
                      {...(() => {
                        const { onBlur, ...nameProps } = register(`options.${index}.name`);
                        return {
                          ...nameProps,
                          onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                            onBlur(e);
                            const raw = getValues(`options.${index}.name`);
                            if (raw) {
                              const formatted = capitalizeTrim(raw);
                              const duplicate = getValues("options").some(
                                (opt, i) => i !== index && opt.name.toLowerCase() === formatted.toLowerCase()
                              );
                              if (duplicate) {
                                setValue(`options.${index}.name`, raw.trim());
                                setError(`options.${index}.name`, { message: "Nome da opção já existe" });
                              } else {
                                setValue(`options.${index}.name`, formatted);
                                clearErrors(`options.${index}.name`);
                              }
                            }
                            onOptionsChange?.();
                          },
                        };
                      })()}
                    />
                    {errors.options?.[index]?.name && (
                      <p className="text-destructive mt-1 text-xs">
                        {errors.options[index]!.name!.message}
                      </p>
                    )}
                  </FieldContent>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="hover:text-destructive text-muted-foreground size-10"
                    onClick={() => {
                      remove(index);
                      onOptionsChange?.();
                    }}
                  >
                    <XIcon className="size-4" />
                  </Button>
                </div>
              </Field>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Field>
                <FieldLabel className="block text-sm font-medium">Valores da opção</FieldLabel>
                <FieldContent>
                  <AddValueInput onAdd={(v) => addValue(index, v)} />
                </FieldContent>
              </Field>

              {values.map((val, vi) => (
                <span
                  key={`${field.id}-${vi}`}
                  className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-md px-3 py-1 pr-2 text-xs font-medium"
                >
                  {val}
                  <Button
                    variant="ghost"
                    className="hover:text-destructive p-1"
                    onClick={() => removeValue(index, vi)}
                  >
                    <XIcon className="size-4" />
                  </Button>
                </span>
              ))}
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          append({ name: "", values: [] });
          onOptionsChange?.();
        }}
      >
        + Adicionar Opção
      </Button>
    </div>
  );
}

function AddValueInput({ onAdd }: { onAdd: (value: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <Input
      ref={ref}
      placeholder="Ex: Azul"
      className="h-7 w-28 text-xs"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const val = e.currentTarget.value.trim();
          if (!val) return;
          onAdd(val);
          e.currentTarget.value = "";
        }
      }}
      onBlur={(e) => {
        const val = e.currentTarget.value.trim();
        if (!val) return;
        onAdd(val);
        e.currentTarget.value = "";
      }}
    />
  );
}
