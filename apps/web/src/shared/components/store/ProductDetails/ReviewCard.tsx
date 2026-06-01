import { Star } from "lucide-react";

import type { Review } from "@/shared/components/Store/ProductDetails/ReviewsSection";

export const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="border-border rounded-lg border p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold tracking-tight uppercase">{review.author}</p>
          <p className="text-muted-foreground font-mono text-[10px]">{review.location}</p>
        </div>
        <div className="flex">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`size-3.5 ${
                i < review.rating ? "fill-yellow-400 stroke-yellow-400" : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
    </div>
  );
};
