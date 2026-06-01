const fullStars = Math.floor(ratingRate);
const hasHalfStar = ratingRate - fullStars >= 0.5;

<div className="flex items-center gap-2">
  <div className="flex">
    {Array.from({ length: 5 }, (_, i) => {
      const isFilled = i < fullStars;
      const isHalf = !isFilled && hasHalfStar && i === fullStars;
      return (
        <Star
          key={i}
          className={`size-4 ${
            isFilled
              ? "fill-yellow-400 stroke-yellow-400"
              : isHalf
                ? "fill-yellow-400/50 stroke-yellow-400"
                : "text-muted-foreground"
          }`}
        />
      );
    })}
  </div>
  <span className="text-muted-foreground font-mono text-xs">{ratingCount} avaliações</span>
</div>;
