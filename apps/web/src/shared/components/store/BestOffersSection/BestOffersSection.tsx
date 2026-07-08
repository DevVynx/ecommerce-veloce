import { getProducts } from "@/shared/actions/products/getProducts";
import { SectionError } from "@/shared/components/SectionError";
import { BestOffersCarousel } from "@/shared/components/Store/BestOffersSection/BestOffersCarousel";

export const BestOffersSection = async () => {
  const { data, error } = await getProducts({ onSale: true, limit: 15 });

  if (error) {
    return (
      <section className="bg-neutral-100 px-2 py-12">
        <div className="relative mx-auto lg:container">
          <SectionError
            title="Ofertas indisponíveis"
            description="Não foi possível carregar as ofertas no momento. Tente novamente mais tarde."
            toastDuration={6000}
          />
        </div>
      </section>
    );
  }

  const products =
    data?.products.sort((a, b) => {
      const discountA = (a.display.price - a.display.salePrice) / a.display.price;
      const discountB = (b.display.price - b.display.salePrice) / b.display.price;
      return discountB - discountA;
    }) ?? [];

  return (
    <section id="bestOffersSection" className="bg-neutral-100 px-2 py-12">
      <div className="relative mx-auto lg:container">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <header className="flex flex-wrap items-center gap-3">
            <div className="ml-2 space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <span className="text-xs font-bold tracking-wider text-red-500 uppercase">
                  Tempo limitado
                </span>
              </div>
              <h1 className="text-xl font-bold">Melhores ofertas</h1>
            </div>
          </header>
        </div>

        <BestOffersCarousel products={products} />
      </div>
    </section>
  );
};
