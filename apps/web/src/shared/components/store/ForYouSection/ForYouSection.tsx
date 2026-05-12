import { getProducts } from "@/shared/actions/products/getProducts";
import { SectionError } from "@/shared/components/SectionError";

import { ForYouSectionContent } from "./ForYouSectionContent";

export const ForYouSection = async () => {
  const { data, error } = await getProducts();

  if (error) {
    return (
      <section id="forYouSection" className="px-2 py-12">
        <div className="mx-auto lg:container">
          <SectionError
            title="Produtos indisponíveis"
            description="Não foi possível carregar esta seção. Tente novamente mais tarde."
            toastDuration={6000}
          />
        </div>
      </section>
    );
  }

  const products = data?.products ?? [];

  return <ForYouSectionContent products={products} />;
};
