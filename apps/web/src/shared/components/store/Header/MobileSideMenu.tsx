"use client";
import { motion } from "framer-motion";
import { FileQuestionMark, LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { logout } from "@/shared/actions/auth/logout";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Separator } from "@/shared/components/shadcn-ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/shadcn-ui/sheet";
import { useAuthState } from "@/shared/states/auth";
import { clearAllStorages } from "@/shared/utils/store/state/clearAllStorages";

import { sideMenuPersonalActionIcons, sideMenuStoreActionIcons } from "./MenuActions";
import { MobileSideMenuItem } from "./MobileSideMenuItem";

export const MobileSideMenu = () => {
  const { user } = useAuthState();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 },
  };

  const handleNavigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const handleLogout = async () => {
    setOpen(false);
    clearAllStorages();
    await logout();
    router.push("/login");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="lg:hidden" asChild>
        <Button variant="ghost" className="p-1">
          {<Menu className="size-7 cursor-pointer" />}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-background flex h-full max-w-[85%] flex-col border-l p-0 sm:max-w-100"
      >
        {/* Header com Perfil - Ajustado para reduzir o vácuo */}
        <SheetHeader className="bg-muted border-border/10 flex flex-row items-center gap-4 border-b px-6 py-5 text-left">
          <div className="bg-primary/10 text-primary flex size-14 shrink-0 items-center justify-center rounded-full shadow-inner">
            <User className="size-8" />
          </div>
          <div className="flex flex-col gap-0.5 overflow-hidden">
            <SheetTitle className="truncate text-xl font-bold tracking-tight">
              Olá, {user?.name ? user.name.split(" ")[0] : "Visitante"}!
            </SheetTitle>
            <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              BeliBeli • Bem-vindo
            </p>
          </div>
        </SheetHeader>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="scrollbar-hide flex flex-1 flex-col overflow-y-auto px-4 pt-4 pb-6"
        >
          {/* Painel Administrativo */}
          {user?.role === "ADMIN" && (
            <section className="mb-6">
              <h3 className="text-muted-foreground mb-2 px-3 text-[11px] font-black tracking-widest uppercase">
                Admin
              </h3>
              <div className="space-y-0.5">
                <motion.div variants={itemVariants}>
                  <MobileSideMenuItem
                    icon={<LayoutDashboard className="size-7" />}
                    label="Painel Administrativo"
                    link="/admin"
                  />
                </motion.div>
              </div>
            </section>
          )}

          {/* Seção Loja */}
          <section className="mb-6">
            <h3 className="text-muted-foreground mb-2 px-3 text-[11px] font-black tracking-widest uppercase">
              Explorar Loja
            </h3>
            <div className="space-y-0.5">
              {sideMenuStoreActionIcons.map((item) => (
                <motion.div key={item.label} variants={itemVariants}>
                  <MobileSideMenuItem
                    icon={item.icon}
                    label={item.label}
                    className={item.className}
                    link={item.link}
                    onClick={() => handleNavigate(item.link)}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          <Separator className="bg-border/40 mx-3 mb-6 w-auto" />

          {/* Seção Pessoal */}
          <section className="mb-6">
            <h3 className="text-muted-foreground mb-2 px-3 text-[11px] font-black tracking-widest uppercase">
              Minha Conta
            </h3>
            <div className="space-y-0.5">
              {sideMenuPersonalActionIcons.map((item) => (
                <motion.div key={item.label} variants={itemVariants}>
                  <MobileSideMenuItem
                    icon={item.icon}
                    label={item.label}
                    link={item.link}
                    onClick={() => handleNavigate(item.link)}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        </motion.div>

        {/* Footer / Rodapé Integrado e Refinado */}
        <SheetFooter className="bg-muted flex border-t p-4 sm:flex-col-reverse">
          {user && (
            <button
              className="group hover:bg-destructive/10 flex w-full cursor-pointer items-center gap-4 rounded-xl px-3 py-3 transition-all"
              onClick={handleLogout}
            >
              <div className="bg-background text-destructive group-hover:bg-destructive/10 group-hover:text-destructive flex size-10 items-center justify-center rounded-lg shadow-xs transition-colors">
                <LogOut className="size-5" />
              </div>
              <span className="text-destructive group-hover:text-destructive text-sm font-semibold transition-colors">
                Sair da conta
              </span>
            </button>
          )}

          <button
            className="group hover:bg-accent flex w-full cursor-pointer items-center gap-4 rounded-xl px-3 py-3 transition-all"
            onClick={() => {}}
          >
            <div className="bg-background text-muted-foreground group-hover:text-primary flex size-10 items-center justify-center rounded-lg shadow-xs transition-colors">
              <FileQuestionMark className="size-5" />
            </div>
            <span className="text-foreground/70 group-hover:text-foreground text-sm font-semibold transition-colors">
              Ajuda & Suporte
            </span>
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
