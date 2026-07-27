import { Star } from "lucide-react";

import { getProductBySlug } from "@/shared/actions/products/getProductBySlug";
import { SectionError } from "@/shared/components/SectionError";
import { ProductRecommendations } from "@/shared/components/Store/ProductDetails/ProductRecommendations";
import { ProductVariantProvider } from "@/shared/context/ProductVariantContext";

import { LiveStockBadge } from "./LiveStockBadge";
import { PriceDisplay } from "./PriceDisplay";
import { ProductActions } from "./ProductActions";
import { ProductGallerySection } from "./ProductGallerySection";
import { ProductInteractionBar } from "./ProductInteractionBar";
import { ProductTabsSection } from "./ProductTabsSection";
import { SkuDisplay } from "./SkuDisplay";
import { VariantSelector } from "./VariantSelector";

type ProductDetailsServerProps = {
  params: Promise<{ slug: string }>;
};

export const ProductDetailsServer = async ({ params }: ProductDetailsServerProps) => {
  const { slug } = await params;
  const { data, error } = await getProductBySlug({ slug });

  if (!data || error) {
    return (
      <SectionError
        title="Produto Indisponível"
        description="Não foi possível carregar o produto no momento. Tente novamente mais tarde."
        toastDuration={6000}
      />
    );
  }

  const { product, options } = data;

  return (
    <div className="container mx-auto mt-10 px-2 py-8 md:px-0">
      <ProductVariantProvider data={data}>
        <section className="mb-10 flex flex-col gap-8 lg:flex-row lg:gap-10">
          <div className="w-full lg:sticky lg:top-24 lg:max-h-150 lg:max-w-155 lg:flex-2 lg:overflow-hidden xl:max-w-200">
            <ProductGallerySection title={product.title} />
          </div>

          <div className="flex w-full flex-col lg:flex-1 lg:justify-between">
            <div>
              <SkuDisplay />

              <h1 className="mt-4 text-xl leading-tight font-bold lg:text-2xl">{product.title}</h1>

              <p className="mt-4 line-clamp-4 text-sm leading-6">{product.description}</p>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1">
                    <Star className="size-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-semibold lg:text-sm">
                      {product.ratingRate.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-sm lg:hidden">
                    ({product.ratingCount > 9999 ? "9999+" : product.ratingCount})
                  </span>
                  <span className="text-muted-foreground hidden text-sm lg:flex">
                    ({product.ratingCount > 9999 ? "9999+" : product.ratingCount} avaliações)
                  </span>
                </div>

                <LiveStockBadge />
              </div>

              <PriceDisplay />

              {options.length > 0 && <VariantSelector />}
            </div>
            <div>
              <ProductActions />

              <ProductInteractionBar productTitle={product.title} />
            </div>
          </div>
        </section>
      </ProductVariantProvider>

      <ProductTabsSection data={data} />

      <ProductRecommendations categoryId={product.category.id} />
    </div>
  );
};
