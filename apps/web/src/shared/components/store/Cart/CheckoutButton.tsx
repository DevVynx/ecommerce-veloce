import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { LoginModal } from "@/shared/components/auth/login/LoginModal";
import { Button } from "@/shared/components/shadcn-ui/button";
import { useAuthState } from "@/shared/states/auth";

export const CheckoutButton = () => {
  const { isAuthenticated } = useAuthState();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  if (isAuthenticated) {
    return (
      <Button className="w-full" size="lg" asChild>
        <Link href="/checkout">
          <ShoppingCart className="size-4" />
          Finalizar Compra
        </Link>
      </Button>
    );
  }

  return (
    <>
      <Button className="w-full cursor-pointer" size="lg" onClick={() => setLoginModalOpen(true)}>
        <ShoppingCart className="size-4" />
        Finalizar Compra
      </Button>

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} redirectTo="/checkout" />
    </>
  );
};
