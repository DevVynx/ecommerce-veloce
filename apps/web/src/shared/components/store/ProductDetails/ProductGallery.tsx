"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/shared/components/shadcn-ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/shared/components/shadcn-ui/carousel";

type ProductGalleryProps = {
  images: string[];
  title: string;
};

export const ProductGallery = ({ images, title }: ProductGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    api?.scrollTo(index);
  };

  return (
    <div className="flex h-full flex-col-reverse gap-3 lg:flex-row">
      {images.length > 1 && (
        <div className="flex w-full overflow-y-auto lg:w-auto">
          <div className="flex w-26 gap-3 p-2 lg:flex-col">
            {images.map((img, i) => (
              <Button
                key={i}
                variant="ghost"
                onClick={() => handleThumbnailClick(i)}
                className={`bg-muted aspect-square w-full rounded-lg p-1 ${
                  i === selectedIndex ? "ring-1 ring-black" : "opacity-50 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="aspect-square w-full object-contain" />
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-muted relative flex flex-1 items-center overflow-hidden rounded-lg">
        <Carousel setApi={setApi}>
          <CarouselContent>
            {images.map((img, i) => (
              <CarouselItem key={i}>
                <img
                  src={img}
                  alt={`${title} - ${i + 1}`}
                  className="aspect-square w-full object-contain"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-2 z-10 hidden -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm lg:flex"
                disabled={!canScrollPrev}
                onClick={() => api?.scrollPrev()}
              >
                <ArrowLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 right-2 z-10 hidden -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm lg:flex"
                disabled={!canScrollNext}
                onClick={() => api?.scrollNext()}
              >
                <ArrowRight className="size-4" />
              </Button>
            </>
          )}
        </Carousel>

        {images.length > 1 && (
          <span className="absolute right-2 bottom-2 z-10 rounded-md bg-black/60 px-2 py-0.5 font-mono text-xs text-white">
            {selectedIndex + 1}/{images.length}
          </span>
        )}
      </div>
    </div>
  );
};
