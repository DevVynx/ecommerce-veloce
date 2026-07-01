import { productRepositories } from "@/modules/product/repositories";

type UpdateRatingAggregatesParams = {
  productId: string;
};

export const updateRatingAggregates = async ({ productId }: UpdateRatingAggregatesParams) => {
  await productRepositories.updateRatingAggregates({ productId });
};
