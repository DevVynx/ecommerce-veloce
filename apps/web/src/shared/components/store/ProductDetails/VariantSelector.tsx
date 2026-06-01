"use client";
import { Button } from "@/shared/components/shadcn-ui/button";
import { useProductVariantContext } from "@/shared/context/ProductVariantContext";

export const VariantSelector = () => {
  const { options, selectedOptions, setSelectedOptions } = useProductVariantContext();

  const handleSelectOption = (optionId: string, valueId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: valueId }));
  };

  return (
    <div className="mb-6 space-y-6">
      {options.map((option) => {
        const currentSelectedId = selectedOptions[option.id];
        const currentSelectedValueName =
          option.values.find((v) => v.id === currentSelectedId)?.value || "Selecione";
        const hasSelection = currentSelectedId !== undefined;
        const isSizeType = option.name.toLowerCase() === "tamanho";
        const sizeClass = isSizeType && option.values.length > 6 ? "size-10" : "px-4 py-1.5";

        return (
          <div key={option.id}>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-foreground text-sm font-semibold tracking-widest">
                {option.name}:
              </span>
              <span
                className={`text-sm tracking-widest ${
                  hasSelection ? "text-muted-foreground" : "text-foreground"
                }`}
              >
                {currentSelectedValueName}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isSelected = currentSelectedId === value.id;

                return (
                  <Button
                    key={value.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSelectOption(option.id, value.id)}
                    className={`font-mono text-xs tracking-widest uppercase ${sizeClass} ${
                      isSelected ? "" : "text-foreground hover:border-primary"
                    }`}
                  >
                    {value.value}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
