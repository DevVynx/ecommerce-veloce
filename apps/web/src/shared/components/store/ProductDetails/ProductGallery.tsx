"use client";
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

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
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
          <div className="my-1 mr-2 ml-1 flex w-26 gap-3 lg:flex-col">
            {images.map((img, i) => (
              <Button
                key={i}
                variant="ghost"
                onClick={() => handleThumbnailClick(i)}
                className={`bg-muted aspect-square w-full overflow-hidden rounded-lg p-0 ${
                  i === selectedIndex ? "ring-1 ring-black" : "opacity-50 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-muted relative flex flex-1 rounded-lg">
        <Carousel setApi={setApi} opts={{ duration: 0 }} className="h-full w-full">
          <CarouselContent className="h-full">
            {images.map((img, i) => (
              <CarouselItem key={i} className="h-full">
                <img
                  src={img}
                  alt={`${title} - ${i + 1}`}
                  className="h-full w-full rounded-lg object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
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
