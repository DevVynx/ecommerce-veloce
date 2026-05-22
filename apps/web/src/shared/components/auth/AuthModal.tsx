import { useEffect, useState } from "react";

import { GoogleSocialLoginButton } from "@/shared/components/auth/GoogleSocialLoginButton";
import { LoginForm } from "@/shared/components/auth/login/LoginForm";
import { OrDivider } from "@/shared/components/auth/OrDivider";
import { RegisterForm } from "@/shared/components/auth/register/RegisterForm";
import { Button } from "@/shared/components/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/shadcn-ui/dialog";
import { useAuthState } from "@/shared/states/auth";

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectTo?: string;
};

export const AuthModal = ({ open, onOpenChange, redirectTo = "/checkout" }: AuthModalProps) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const { setAuthError } = useAuthState();

  useEffect(() => {
    if (open) {
      setMode("login");
      setAuthError(null);
    }
  }, [open, setAuthError]);

  const isLogin = mode === "login";

  const handleToggle = () => {
    setAuthError(null);
    setMode(isLogin ? "register" : "login");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {isLogin ? "Login" : "Criar Conta"}
          </DialogTitle>
          <p className="text-muted-foreground text-center text-sm">
            {isLogin
              ? "Faça login para finalizar sua compra"
              : "Crie sua conta para finalizar sua compra"}
          </p>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {isLogin ? (
            <LoginForm redirectTo={redirectTo} />
          ) : (
            <RegisterForm redirectTo={redirectTo} />
          )}

          <p className="text-center text-sm text-black/60">
            {isLogin ? (
              <>
                Não possui uma conta?{" "}
                <Button
                  variant={"link"}
                  onClick={handleToggle}
                  className="text-card-foreground hover:text-muted-foreground p-0 font-bold"
                >
                  Crie uma
                </Button>
              </>
            ) : (
              <>
                Já possui uma conta?{" "}
                <Button
                  variant={"link"}
                  onClick={handleToggle}
                  className="text-card-foreground hover:text-muted-foreground p-0 font-bold"
                >
                  Faça login
                </Button>
              </>
            )}
          </p>

          <div className="w-full">
            <OrDivider />
            <GoogleSocialLoginButton redirectTo={redirectTo} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
