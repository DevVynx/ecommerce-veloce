"use client";
import type { PublicProductDto } from "@repo/types/contracts";

import { ProductCard } from "@/shared/components/store/ProductCard";

type ForYouSectionContentProps = {
  products: PublicProductDto[];
};

export const ForYouSectionContent = ({ products }: ForYouSectionContentProps) => {
  return (
    <section id="forYouSection" className="px-2 py-12">
      <div className="mx-auto lg:container">
        <h1 className="text-center text-xl font-bold">Para você!</h1>

        <div className="grid grid-cols-2 gap-6 py-10 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} grid />
          ))}
        </div>
      </div>
    </section>
  );
};
