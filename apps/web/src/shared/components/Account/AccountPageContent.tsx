"use client";
import { LogOut, Package, Settings, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { logout } from "@/shared/actions/auth/logout";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Separator } from "@/shared/components/shadcn-ui/separator";
import { Tabs } from "@/shared/components/shadcn-ui/tabs";
import { useAuthState } from "@/shared/states/auth";
import { clearAllStorages } from "@/shared/utils/store/state/clearAllStorages";

type AccountPageContentProps = {
  children: ReactNode;
};

export const AccountPageContent = ({ children }: AccountPageContentProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthState();

  const activeTab = searchParams.get("tab") ?? "profile";

  const handleTabChange = (value: string) => {
    router.push(`/account?tab=${value}`, { scroll: false });
  };

  const handleLogout = async () => {
    clearAllStorages();
    await logout();
    router.push("/login");
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <div className="container mx-auto px-4 py-16 md:px-0">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:flex lg:flex-col lg:gap-1">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex size-14 shrink-0 items-center justify-center rounded-full shadow-inner">
                <User className="size-8" />
              </div>
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              <button
                onClick={() => handleTabChange("profile")}
                className={`hover:bg-muted flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === "profile" ? "bg-muted text-foreground" : "text-muted-foreground"
                }`}
              >
                <User className="size-4" />
                Perfil
              </button>
              <button
                onClick={() => handleTabChange("orders")}
                className={`hover:bg-muted flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === "orders" ? "bg-muted text-foreground" : "text-muted-foreground"
                }`}
              >
                <Package className="size-4" />
                Pedidos
              </button>
              <button
                onClick={() => handleTabChange("settings")}
                className={`hover:bg-muted flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === "settings" ? "bg-muted text-foreground" : "text-muted-foreground"
                }`}
              >
                <Settings className="size-4" />
                Configurações
              </button>
            </nav>
            <Separator className="my-4" />
            <Button
              variant="ghost"
              className="justify-start text-red-500 hover:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 size-4" />
              Sair da conta
            </Button>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </Tabs>
  );
};
