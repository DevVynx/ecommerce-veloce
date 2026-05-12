"use client";
import { MoveLeft, MoveRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import type { CarouselApi } from "@/shared/components/shadcn-ui/carousel";

type ProductsCarouselControlsProps = {
  api: CarouselApi | undefined;
};

export const ProductsCarouselControls = ({ api }: ProductsCarouselControlsProps) => {
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <div className="flex gap-2">
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className="hover:bg-muted flex h-8 w-20 cursor-pointer items-center justify-center rounded-md border border-black transition-colors disabled:cursor-auto disabled:opacity-50"
      >
        <MoveLeft className="size-5" />
      </button>
      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className="hover:bg-muted flex h-8 w-20 cursor-pointer items-center justify-center rounded-md border border-black transition-colors disabled:cursor-auto disabled:opacity-50"
      >
        <MoveRight className="size-5" />
      </button>
    </div>
  );
};
