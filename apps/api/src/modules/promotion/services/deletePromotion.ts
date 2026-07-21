import { promotionRepositories } from "@/modules/promotion/repositories";
import { NotFoundError } from "@/shared/utils/HttpErrors";

export const deletePromotion = async (id: string) => {
  const promotion = await promotionRepositories.findById(id);

  if (!promotion) {
    throw new NotFoundError("Promoção não encontrada.");
  }

  await promotionRepositories.deletePromotion(id);
};
