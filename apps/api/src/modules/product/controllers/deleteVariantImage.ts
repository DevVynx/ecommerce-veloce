import { RequestHandler } from "express";
import { productServices } from "@/modules/product/services";
import { BadRequestError } from "@/shared/utils/HttpErrors";

export const deleteVariantImage: RequestHandler = async (req, res) => {
  const publicId = req.params.publicId as string | undefined;

  if (!publicId) {
    throw new BadRequestError("publicId é obrigatório");
  }

  await productServices.deleteVariantImage(publicId);

  res.json({ message: "Imagem removida com sucesso" });
};
