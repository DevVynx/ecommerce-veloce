"use client";
import { Handbag, LogOut, Tickets, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { logout } from "@/shared/actions/auth/logout";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Separator } from "@/shared/components/shadcn-ui/separator";
import { useAuthState } from "@/shared/states/auth";
import { clearAllStorages } from "@/shared/utils/store/state/clearAllStorages";

export const UserMenuContentAuthenticated = () => {
  const { user } = useAuthState();
  const router = useRouter();

  const handleLogout = async () => {
    clearAllStorages();
    await logout();
    router.push("/login");
  };

  return (
    <div className="flex w-56 flex-col">
      {/* Header com avatar e boas-vindas */}
      <div className="flex items-center gap-3 px-4 py-4">
        <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
          <User className="size-5" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm font-semibold">Olá, {user?.name?.split(" ")[0]}</span>
          <span className="text-muted-foreground truncate text-xs">Bem-vindo à BeliBeli</span>
        </div>
      </div>

      <Separator />

      {/* Links da conta */}
      <div className="flex flex-col py-2">
        <Link
          href="/profile"
          className="hover:bg-muted flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm transition-colors"
        >
          <User className="size-5" />
          Meu Perfil
        </Link>

        <Link
          href="/orders"
          className="hover:bg-muted flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm transition-colors"
        >
          <Handbag className="size-5" />
          Meus Pedidos
        </Link>

        <Link
          href="/coupons"
          className="hover:bg-muted flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm transition-colors"
        >
          <Tickets className="size-5" />
          Meus Cupons
        </Link>
      </div>

      <Separator />

      {/* Logout */}
      <div className="py-2">
        <Button
          variant="ghost"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full justify-start gap-2 rounded-none px-4 py-2.5 text-sm"
          onClick={handleLogout}
        >
          <LogOut className="size-5" />
          Sair da conta
        </Button>
      </div>
    </div>
  );
};
