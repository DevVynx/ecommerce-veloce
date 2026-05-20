import Link from "next/link";

import { GoogleSocialLoginButton } from "@/shared/components/auth/GoogleSocialLoginButton";
import { OrDivider } from "@/shared/components/auth/OrDivider";
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Login</DialogTitle>
          <p className="text-muted-foreground text-center text-sm">
            Faça login para finalizar sua compra
          </p>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <LoginForm redirectTo={redirectTo} />

          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-sm text-black/60">
              Não possui uma conta?{" "}
              <Link
                href="/register"
                onClick={() => onOpenChange(false)}
                className="text-card-foreground hover:text-muted-foreground font-bold underline"
              >
                Crie uma
              </Link>
            </p>
          </div>

          <div className="w-full">
            <OrDivider />
            <GoogleSocialLoginButton redirectTo={redirectTo} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
