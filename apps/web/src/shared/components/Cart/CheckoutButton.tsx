import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthModal } from "@/shared/components/Auth/AuthModal";
import { Button } from "@/shared/components/shadcn-ui/button";
import { useAuthState } from "@/shared/states/auth";

type CheckoutButtonProps = {
  buttonClassname: string;
  onBeforeNavigate?: () => void;
};

export const CheckoutButton = ({ buttonClassname, onBeforeNavigate }: CheckoutButtonProps) => {
  const { isAuthenticated } = useAuthState();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const router = useRouter();

  if (isAuthenticated) {
    return (
      <Button
        className={buttonClassname}
        onClick={() => {
          onBeforeNavigate?.();
          setTimeout(() => router.push("/checkout"), 0);
        }}
      >
        <ShoppingCart className="size-5" />
        Finalizar Compra
      </Button>
    );
  }

  return (
    <>
      <Button
        className={buttonClassname}
        onClick={() => {
          onBeforeNavigate?.();
          setTimeout(() => setAuthModalOpen(true), 0);
        }}
      >
        <ShoppingCart className="size-5" />
        Finalizar Compra
      </Button>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} redirectTo="/checkout" />
    </>
  );
};
