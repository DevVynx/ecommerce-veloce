import { GoogleSocialLoginButton } from "@/shared/components/auth/GoogleSocialLoginButton";
import { OrDivider } from "@/shared/components/auth/OrDivider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/shadcn-ui/dialog";

import { RegisterForm } from "./RegisterForm";

type RegisterModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectTo?: string;
};

export const RegisterModal = ({
  open,
  onOpenChange,
  redirectTo = "/checkout",
}: RegisterModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Criar Conta</DialogTitle>
          <p className="text-muted-foreground text-center text-sm">
            Crie sua conta para finalizar sua compra
          </p>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <RegisterForm redirectTo={redirectTo} />

          <div className="w-full">
            <OrDivider />
            <GoogleSocialLoginButton redirectTo={redirectTo} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
