"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/shared/components/shadcn-ui/button";
import { cn } from "@/shared/utils/lib/utils";

import { ErrorNotification } from "./ErrorNotification";

type SectionErrorProps = {
  title?: string;
  description?: string;
  showToast?: boolean;
  toastDuration?: number;
  className?: string;
};

export const SectionError = ({
  title = "Conteúdo indisponível",
  description = "Não foi possível carregar esta seção. Tente novamente mais tarde.",
  showToast = true,
  toastDuration = 4000,
  className,
}: SectionErrorProps) => {
  return (
    <>
      {showToast && (
        <ErrorNotification title={title} message={description} duration={toastDuration} />
      )}
      <div className={cn("flex flex-col items-center justify-center px-4 py-12", className)}>
        <div className="bg-muted mb-4 rounded-full p-3">
          <AlertTriangle className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm text-center text-sm">{description}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    </>
  );
};
