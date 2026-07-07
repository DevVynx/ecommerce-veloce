import type { ReactNode } from "react";
import {
  CheckCircle2,
  Clock,
  Loader,
  RotateCcw,
  Truck,
  XCircle,
} from "lucide-react";

export type StatusConfigEntry = {
  label: string;
  icon: ReactNode;
  className: string;
};

export const STATUS_CONFIG: Record<string, StatusConfigEntry> = {
  PENDING: {
    label: "Pendente",
    icon: <Clock className="size-3.5" />,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  PAID: {
    label: "Pago",
    icon: <CheckCircle2 className="size-3.5" />,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  PROCESSING: {
    label: "Processando",
    icon: <Loader className="size-3.5 animate-spin" />,
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  SHIPPED: {
    label: "Enviado",
    icon: <Truck className="size-3.5" />,
    className: "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  DELIVERED: {
    label: "Entregue",
    icon: <CheckCircle2 className="size-3.5" />,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  CANCELED: {
    label: "Cancelado",
    icon: <XCircle className="size-3.5" />,
    className: "border-red-200 bg-red-50 text-red-700",
  },
  REFUNDED: {
    label: "Reembolsado",
    icon: <RotateCcw className="size-3.5" />,
    className: "border-purple-200 bg-purple-50 text-purple-700",
  },
};
