import { cartServices } from "@/modules/cart/services";
import { calculateShippings } from "@/modules/shipping/helpers/calculateShippings";
import type { GetShippingQuoteParams } from "@/modules/shipping/types/ServiceParams";
import { ForbiddenError, NotFoundError } from "@/shared/utils/HttpErrors";

export const getShippingQuote = async ({ userId, destinyCep }: GetShippingQuoteParams) => {
  const { cart } = await cartServices.findCartByUserId({ userId });

  if (!cart) throw new NotFoundError("Carrinho não encontrado.");
  if (cart.items.length === 0) throw new ForbiddenError("Carrinho vazio.");

  let weight = 0;
  for (const item of cart.items) {
    const { variant } = item.product;
    if (variant.weight <= 0) {
      throw new ForbiddenError(
        `Produto ${item.product.id} não possui peso válido para cálculo de frete.`
      );
    }
    weight += variant.weight * item.quantity;
  }

  if (weight <= 0) throw new ForbiddenError("Peso total inválido.");

  const price = Number(cart.summary.total);

  const shippingOptions = calculateShippings({
    destinyCep,
    weight: Number(weight.toFixed(2)),
    price,
  });

  const freeShippingMinValue = Number(process.env.FREE_SHIPPING_MIN_VALUE) || 200;

  if (price >= freeShippingMinValue) {
    shippingOptions.forEach((opt) => {
      opt.price = 0;
    });
  }

  return {
    items: { quantity: cart.summary.count, weight: Number(weight.toFixed(2)) },
    freeShippingMinValue,
    shippingOptions,
  };
};
