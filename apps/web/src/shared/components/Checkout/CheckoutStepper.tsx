import { cn } from "@/shared/utils/lib/utils";

const STEPS = ["Endereço", "Frete", "Pagamento", "Revisar Pedido"];

type CheckoutStepperProps = {
  currentStep: number;
};

export const CheckoutStepper = ({ currentStep }: CheckoutStepperProps) => {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      {STEPS.map((label, index) => (
        <div key={label} className="flex items-center gap-1.5">
          {index > 0 && <span className="text-muted-foreground">/</span>}
          <span
            className={cn(
              "transition-colors",
              index === currentStep ? "text-foreground font-semibold" : "text-muted-foreground"
            )}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};
