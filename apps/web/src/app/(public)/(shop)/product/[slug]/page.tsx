import type { Metadata } from "next";
import { Suspense } from "react";

import { getProductBySlug } from "@/shared/actions/products/getProductBySlug";
import { ProductDetailsServer } from "@/shared/components/Store/ProductDetails/ProductDetailsServer";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const { data } = await getProductBySlug({ slug });

  if (!data) {
    return { title: "Produto não encontrado | BeliBeli Store" };
  }

  return {
    title: `${data.product.title} | BeliBeli Store`,
    description: data.product.description,
  };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  return (
    <Suspense fallback={null}>
      <ProductDetailsServer params={params} />
    </Suspense>
  );
};

export default ProductPage;
