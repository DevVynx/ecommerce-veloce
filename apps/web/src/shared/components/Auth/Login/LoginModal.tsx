import { GoogleSocialLoginButton } from "@/shared/components/Auth/GoogleSocialLoginButton";
import { OrDivider } from "@/shared/components/Auth/OrDivider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/shadcn-ui/dialog";

import { LoginForm } from "./LoginForm";

type LoginModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectTo?: string;
};

export const LoginModal = ({ open, onOpenChange, redirectTo = "/checkout" }: LoginModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Login</DialogTitle>
          <p className="text-muted-foreground text-center text-sm">
            Faça login para finalizar sua compra
          </p>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <LoginForm redirectTo={redirectTo} />

          <div className="hidden w-full">
            <OrDivider />
            <GoogleSocialLoginButton redirectTo={redirectTo} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
