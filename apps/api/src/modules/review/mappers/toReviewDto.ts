import type { ReviewDto } from "@repo/types/contracts";

import { formatVariantLabel } from "@/modules/review/helpers/formatVariantLabel";

import type { Prisma } from "../../../../prisma/generated/client/client";

type ReviewRaw = Prisma.ReviewGetPayload<{
  include: {
    user: { select: { name: true } };
    variant: {
      include: {
        productVariantOptions: {
          include: { productOptionValue: { include: { productOption: true } } };
        };
      };
    };
  };
}>;

export const toReviewDto = (raw: ReviewRaw): ReviewDto => ({
  id: raw.id,
  author: raw.user.name,
  rating: raw.rating,
  comment: raw.comment,
  createdAt: raw.createdAt.toISOString(),
  variantLabel: formatVariantLabel(raw.variant.productVariantOptions),
});
