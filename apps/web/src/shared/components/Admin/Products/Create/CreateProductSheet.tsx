"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/shadcn-ui/drawer";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/shadcn-ui/sheet";
import { useScreenSize } from "@/shared/hooks/ui/useScreenSize";

import { CreateProductForm } from "./CreateProductForm";

type CreateProductSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  categories: { id: string; name: string }[];
};

export function CreateProductSheet({
  open,
  onOpenChange,
  onSuccess,
  categories,
}: CreateProductSheetProps) {
  const { isMobile } = useScreenSize();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Criar Produto</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-6">
            <CreateProductForm categories={categories} onSuccess={onSuccess} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-4xl">
        <SheetHeader>
          <SheetTitle>Criar Produto</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <CreateProductForm categories={categories} onSuccess={onSuccess} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
