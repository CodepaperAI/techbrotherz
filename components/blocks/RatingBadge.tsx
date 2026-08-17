import { Star } from "lucide-react";

import type { ReviewSummary } from "@/content/data/types";

/**
 * The Google rating badge, reading the same ReviewSummary that gates
 * `aggregateRating()` in lib/seo/schema.ts.
 *
 * It renders NOTHING unless the summary is enabled and carries a real rating,
 * a real count and the listing URL: no placeholder, no zero, and no number
 * originates in this file or any other source file. `pnpm verify` carries a
 * guard (scripts/test-no-fake-rating.ts) that fails the build if a literal
 * star rating or review count ever appears in the source instead of flowing
 * from the data. The moment the client's Place ID and key land and
 * getReviewSummary() returns live data, this badge shows whatever the real
 * figure is.
 */
export function RatingBadge({
  reviews,
  className,
}: {
  reviews: ReviewSummary | null;
  className?: string;
}) {
  if (!reviews?.enabled) return null;
  if (typeof reviews.ratingValue !== "number") return null;
  if (typeof reviews.reviewCount !== "number" || reviews.reviewCount < 1) return null;
  if (!reviews.sourceUrl) return null;

  const rounded = Math.round(reviews.ratingValue);

  return (
    <div className={className}>
      <p className="type-numeral text-tb-green-deep">{reviews.ratingValue.toFixed(1)}</p>
      <div
        className="mt-2 flex gap-0.5"
        role="img"
        aria-label={`Rated ${reviews.ratingValue.toFixed(1)} out of 5 on Google`}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            aria-hidden="true"
            size={16}
            strokeWidth={1.5}
            className={
              index < rounded
                ? "fill-tb-green-deep text-tb-green-deep"
                : "text-tb-border fill-none"
            }
          />
        ))}
      </div>
      <p className="type-body text-tb-muted mt-2">
        {reviews.reviewCount.toLocaleString("en-CA")} Google reviews
      </p>
      <a
        href={reviews.sourceUrl}
        target="_blank"
        rel="noopener"
        className="text-tb-green-deep mt-2 inline-block font-medium hover:underline"
      >
        Read all reviews on Google
      </a>
    </div>
  );
}
