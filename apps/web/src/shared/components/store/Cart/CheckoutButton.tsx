import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { LoginModal } from "@/shared/components/auth/login/LoginModal";
import { Button } from "@/shared/components/shadcn-ui/button";
import { useAuthState } from "@/shared/states/auth";

type CheckoutButtonProps = {
  buttonClassname: string;
};

export const CheckoutButton = ({ buttonClassname }: CheckoutButtonProps) => {
  const { isAuthenticated } = useAuthState();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

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
      <Button className={buttonClassname} onClick={() => setLoginModalOpen(true)}>
        <ShoppingCart className="size-5" />
        Finalizar Compra
      </Button>

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} redirectTo="/checkout" />
    </>
  );
};
