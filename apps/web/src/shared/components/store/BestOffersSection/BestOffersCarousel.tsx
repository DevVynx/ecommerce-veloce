"use client";
import type { PublicProductDto } from "@repo/types/contracts";
import { useState } from "react";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/shared/components/shadcn-ui/carousel";
import { ProductCard } from "@/shared/components/store/ProductCard";
import { useScreenSize } from "@/shared/hooks/ui/useScreenSize";

import { ProductsCarouselControls } from "./ProductsCarouselControls";

type BestOffersCarouselProps = {
  products: PublicProductDto[];
};

export const BestOffersCarousel = ({ products }: BestOffersCarouselProps) => {
  const { isMobile } = useScreenSize();
  const [api, setApi] = useState<CarouselApi>();

  return (
    <>
      <div className="absolute top-0 right-0 hidden lg:flex">
        <ProductsCarouselControls api={api} />
      </div>

      <Carousel
        opts={{
          align: "start",
          dragFree: isMobile,
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className="basis-68">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
};
