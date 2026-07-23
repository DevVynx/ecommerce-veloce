import { productRepositories } from "@/modules/product/repositories";

export const getCategories = async () => {
  const categories = await productRepositories.findAllCategories();

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    image: cat.image ?? undefined,
  }));
};
