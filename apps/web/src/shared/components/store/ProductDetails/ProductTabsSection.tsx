import type { GetProductDetailsResponse } from "@repo/types/contracts";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/shadcn-ui/tabs";
import { mockReviews } from "@/shared/components/Store/ProductDetails/mockedReviews";
import { ReviewsSection } from "@/shared/components/Store/ProductDetails/ReviewsSection";

type ProductTabsSectionProps = {
  data: GetProductDetailsResponse;
};

export const ProductTabsSection = async ({ data }: ProductTabsSectionProps) => {
  return (
    <Tabs defaultValue="details">
      <TabsList className="border-border flex justify-start gap-8 border-b bg-transparent shadow-none">
        <TabsTrigger
          value="details"
          className="cursor-pointer rounded-none border-black p-0 text-lg font-semibold transition-none data-[state=active]:border-b-3"
        >
          Detalhes do Produto
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="cursor-pointer rounded-none border-black p-0 text-lg font-semibold transition-none data-[state=active]:border-b-3"
        >
          Avaliações ({data.product.ratingCount})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <div id="product-details" className="pt-6">
          <p className="text-muted-foreground leading-relaxed">{data.product.description}</p>
        </div>
      </TabsContent>
      <TabsContent value="reviews">
        <ReviewsSection
          ratingRate={data.product.ratingRate}
          ratingCount={data.product.ratingCount}
          reviews={mockReviews}
        />
      </TabsContent>
    </Tabs>
  );
};
