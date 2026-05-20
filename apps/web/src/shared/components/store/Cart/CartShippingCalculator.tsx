import { Package, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/components/shadcn-ui/button";
import { Input } from "@/shared/components/shadcn-ui/input";
import { Separator } from "@/shared/components/shadcn-ui/separator";
import { Spinner } from "@/shared/components/shadcn-ui/spinner";
import { formatPrice } from "@/shared/utils/store/price";

export const CartShippingCalculator = () => {
  const [cep, setCep] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<{ method: string; price: number; days: number }[] | null>(
    null
  );

  const handleCepChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 5) {
      setCep(digits);
    } else {
      setCep(`${digits.slice(0, 5)}-${digits.slice(5)}`);
    }
  };

  const handleCalculate = () => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;

    setIsCalculating(true);
    setResult(null);

    setTimeout(() => {
      setResult([
        { method: "PAC", price: 19.9, days: 12 },
        { method: "Sedex", price: 39.9, days: 4 },
      ]);
      setIsCalculating(false);
    }, 1200);
  };

  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <h3 className="mb-3 flex items-center gap-2 font-bold">
        <Package className="text-muted-foreground size-5" />
        Calcular Frete
      </h3>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Digite o seu CEP"
          value={cep}
          onChange={(e) => handleCepChange(e.target.value)}
          className="h-9 w-full text-sm"
          maxLength={9}
        />
        <Button
          variant="outline"
          size="sm"
          className="h-9 cursor-pointer"
          onClick={handleCalculate}
          disabled={cep.replace(/\D/g, "").length !== 8 || isCalculating}
        >
          {isCalculating ? <Spinner className="size-4" /> : <Search className="size-4" />}
          Calcular
        </Button>
      </div>

      {result && (
        <>
          <Separator className="my-4" />
          <div className="space-y-3">
            <p className="text-xs font-medium text-green-700">
              Opções de entrega para <span className="font-bold">{cep}</span>
            </p>
            {result.map((option) => (
              <div
                key={option.method}
                className="flex items-center justify-between rounded-md bg-green-50 px-3 py-2"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{option.method}</span>
                  <span className="text-muted-foreground text-xs">
                    Até {option.days} dias úteis
                  </span>
                </div>
                <span className="text-sm font-bold">
                  {option.price === 0 ? "Grátis" : formatPrice(option.price)}
                </span>
              </div>
            ))}
            <p className="text-muted-foreground mt-1 text-[10px]">
              * Prazo contado a partir da postagem
            </p>
          </div>
        </>
      )}
    </div>
  );
};
