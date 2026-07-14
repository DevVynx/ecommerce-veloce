import { User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BoxIcon } from "@/shared/assets/animatedIcons/box";
import { CircleHelpIcon } from "@/shared/assets/animatedIcons/circle-help";
import { ClipboardListIcon } from "@/shared/assets/animatedIcons/clipboard-list";
import { CornerUpLeftIcon } from "@/shared/assets/animatedIcons/corner-up-left";
import { LayoutGridIcon } from "@/shared/assets/animatedIcons/layout-grid";
import { ReceiptIcon } from "@/shared/assets/animatedIcons/receipt";
import { SettingsIcon } from "@/shared/assets/animatedIcons/settings";
import { TicketPercentIcon } from "@/shared/assets/animatedIcons/ticket-percent";
import { UserCheckIcon } from "@/shared/assets/animatedIcons/user-check";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Separator } from "@/shared/components/shadcn-ui/separator";
import { useAnimatedIcons } from "@/shared/hooks/ui/useAnimatedIcons";
import { useAuthState } from "@/shared/states/auth";

const mainNav = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGridIcon },
  { label: "Produtos", href: "/admin/products", icon: BoxIcon },
  { label: "Promoções", href: "/admin/promotions", icon: ReceiptIcon },
  { label: "Cupons", href: "/admin/coupons", icon: TicketPercentIcon },
  { label: "Pedidos", href: "/admin/orders", icon: ClipboardListIcon },
  { label: "Clientes", href: "/admin/customers", icon: UserCheckIcon },
];

const bottomNav = [
  { label: "Configurações", href: "/admin/settings", icon: SettingsIcon },
  { label: "Suporte", href: "/admin/support", icon: CircleHelpIcon },
];

type AdminSidebarProps = {
  onNavClick?: () => void;
};

export function AdminSidebar({ onNavClick }: AdminSidebarProps) {
  const { user } = useAuthState();
  const pathname = usePathname();
  const { getHandlers, getIconRef } = useAnimatedIcons({
    autoStartDelay: 200,
    autoStartDuration: 1500,
  });

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="flex h-full flex-col pt-5">
      <div className="flex h-16 flex-col justify-center px-6">
        <h1 className="text-2xl font-bold tracking-tight">BELIBELI</h1>
        <p className="text-muted-foreground text-xs tracking-wider uppercase">Painel de Controle</p>
      </div>

      <div className="px-6 pb-4"></div>

      <nav className="flex flex-1 flex-col justify-between px-3">
        <div className="space-y-1">
          {mainNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                {...getHandlers(`${item.label}`)}
                href={item.href}
                onClick={onNavClick}
                data-active={active}
                className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                }`}
              >
                <item.icon
                  ref={getIconRef(item.label)}
                  size={20}
                  {...(item.icon === TicketPercentIcon && {
                    bgClassName: active ? "fill-accent" : "fill-background group-hover:fill-accent",
                  })}
                />
                {item.label}
              </Link>
            );
          })}
        </div>

        <Link {...getHandlers("corner-up-left")} href="/" className="mb-1 w-full">
          <Button className="w-full gap-3 rounded-lg px-4 py-3 text-sm">
            <CornerUpLeftIcon ref={getIconRef("corner-up-left")} size={20} />
            Voltar para a loja
          </Button>
        </Link>
      </nav>

      <div className="space-y-1 px-3">
        <Separator className="my-2" />
        {bottomNav.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              {...getHandlers(`${item.label}`)}
              href={item.href}
              onClick={onNavClick}
              data-active={active}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                active
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
              }`}
            >
              <item.icon key={item.label} ref={getIconRef(`${item.label}`)} size={20} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="px-3 pt-2 pb-6">
        <Separator className="mt-2 mb-4" />
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="bg-secondary flex size-9 items-center justify-center rounded-full">
            <User className="text-muted-foreground size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.name}</span>
            <span className="text-muted-foreground text-xs">{user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
