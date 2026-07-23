"use client";
import { Menu } from "lucide-react";
import { Suspense, useState } from "react";

import { Button } from "@/shared/components/shadcn-ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/shared/components/shadcn-ui/sheet";

import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row lg:gap-6">
      <aside className="border-border bg-card sticky top-0 hidden h-screen w-full max-w-xs flex-col border-r lg:flex">
        <Suspense fallback={null}>
          <AdminSidebar />
        </Suspense>
      </aside>

      <header className="border-border bg-card left-0 z-30 container mx-auto flex h-14 items-center justify-between border-b px-2 lg:hidden">
        <span className="text-lg font-bold">VELOCE</span>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0">
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            <Suspense fallback={null}>
              <AdminSidebar onNavClick={() => setOpen(false)} />
            </Suspense>
          </SheetContent>
        </Sheet>
      </header>

      <main className="container mx-auto min-h-screen flex-1 px-2 py-8 lg:pr-6 lg:pl-0">
        <Suspense fallback={null}>{children}</Suspense>
      </main>
    </div>
  );
}
