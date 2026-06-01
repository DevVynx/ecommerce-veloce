import { Star } from "lucide-react";

import { Progress } from "@/shared/components/Progress";
import { Rating, RatingItem } from "@/shared/components/shadcn-ui/rating";

type ReviewSummaryProps = {
  ratingRate: number;
};

export const ReviewsSummary = ({ ratingRate }: ReviewSummaryProps) => {
  return (
    <div className="w-full rounded-lg border">
      <div className="flex w-full justify-between border-b p-3">
        <div className="flex items-center gap-2">
          <Rating value={ratingRate} step={0.5} readOnly className="gap-2 text-yellow-500">
            {Array.from({ length: 5 }, (_, i) => (
              <RatingItem key={i}>
                <Star className="size-6" />
              </RatingItem>
            ))}
          </Rating>
        </div>
        <h2 className="text-primary pr-1 text-2xl font-bold tracking-wide">{ratingRate}</h2>
      </div>
      <div className="space-y-3 p-3">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground w-3 pl-1 font-semibold">5</span>
          <Progress value={80} indicatorProps={{ className: "bg-yellow-500" }} />
          <span className="w-10 pr-1 text-right font-semibold tabular-nums">300</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground w-3 pl-1 font-semibold">4</span>
          <Progress value={40} indicatorProps={{ className: "bg-yellow-500" }} />
          <span className="w-10 pr-1 text-right font-semibold tabular-nums">150</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground w-3 pl-1 font-semibold">3</span>
          <Progress value={20} indicatorProps={{ className: "bg-yellow-500" }} />
          <span className="w-10 pr-1 text-right font-semibold tabular-nums">75</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground w-3 pl-1 font-semibold">2</span>
          <Progress value={10} indicatorProps={{ className: "bg-yellow-500" }} />
          <span className="w-10 pr-1 text-right font-semibold tabular-nums">30</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground w-3 pl-1 font-semibold">1</span>
          <Progress value={2} indicatorProps={{ className: "bg-yellow-500" }} />
          <span className="w-10 pr-1 text-right font-semibold tabular-nums">6</span>
        </div>
      </div>
    </div>
  );
};
