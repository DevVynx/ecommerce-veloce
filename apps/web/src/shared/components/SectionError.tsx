"use client";
import { CloudOff, RefreshCw } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/shared/components/shadcn-ui/button";
import { cn } from "@/shared/utils/lib/utils";

import { showNotification } from "./showNotification";

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
  useEffect(() => {
    if (showToast) {
      showNotification({ type: "error", title, message: description, duration: toastDuration });
    }
  }, [showToast, title, description, toastDuration]);

  return (
    <>
      <div className={cn("flex flex-col items-center justify-center px-4 py-12", className)}>
        <div className="bg-muted-foreground/10 mb-4 rounded-full p-4">
          <CloudOff className="text-muted-foreground h-15 w-15" />
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
