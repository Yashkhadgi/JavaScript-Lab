import { Star, StarHalf } from "lucide-react";

export default function StarRating({ rating, reviews, size = 14, showCount = true }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full) {
            return <Star key={i} size={size} fill="#ffa41c" stroke="#ffa41c" />;
          }
          if (i === full && half) {
            return <StarHalf key={i} size={size} fill="#ffa41c" stroke="#ffa41c" />;
          }
          return <Star key={i} size={size} fill="none" stroke="#ffa41c" />;
        })}
      </div>
      <span className="text-xs text-navy">{rating}</span>
      {showCount && reviews != null && (
        <span className="text-xs text-link">
          ({reviews.toLocaleString("en-IN")})
        </span>
      )}
    </div>
  );
}
