import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AuthModal } from "@/shared/components/auth/AuthModal";
import { Button } from "@/shared/components/shadcn-ui/button";
import { useAuthState } from "@/shared/states/auth";

type CheckoutButtonProps = {
  buttonClassname: string;
};

export const CheckoutButton = ({ buttonClassname }: CheckoutButtonProps) => {
  const { isAuthenticated } = useAuthState();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (isAuthenticated) {
    return (
      <Button className={buttonClassname} asChild>
        <Link href="/checkout">
          <ShoppingCart className="size-5" />
          Finalizar Compra
        </Link>
      </Button>
    );
  }

  return (
    <>
      <Button className={buttonClassname} onClick={() => setAuthModalOpen(true)}>
        <ShoppingCart className="size-5" />
        Finalizar Compra
      </Button>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} redirectTo="/checkout" />
    </>
  );
};
