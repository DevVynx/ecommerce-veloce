import { productRepositories } from "@/modules/product/repositories";

export const getCategories = async () => {
  return productRepositories.findAllCategories();
};
