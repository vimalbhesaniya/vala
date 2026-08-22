"use client";

import { Star, BadgeCheck } from "lucide-react";
import { ProductGridSkeleton } from "@/components/common/Skeleton";
import { useReviews } from "@/hooks/use-api";

export function ReviewsSection() {
  const { data: reviews = [], isLoading, isError } = useReviews();

  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-[28px] font-medium tracking-tight text-primary sm:text-[40px]">
            What Parents Say
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted sm:text-base">
            Real reviews from families who trust VALA for their school uniforms.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-12">
            <ProductGridSkeleton count={4} />
          </div>
        ) : isError ? (
          <p className="mt-12 text-center text-sm text-muted">Unable to load reviews.</p>
        ) : (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reviews.slice(0, 4).map((review) => (
              <blockquote
                key={review.id}
                className="flex flex-col rounded-2xl border border-border bg-background p-6"
              >
                <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-accent text-accent"
                          : "fill-border text-border"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                  &ldquo;{review.comment}&rdquo;
                </p>

                <footer className="mt-5 border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <cite className="text-sm font-medium text-foreground not-italic">
                      — {review.customerName}
                    </cite>
                    {review.verified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-success">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-xs text-muted">
                    {review.productName} · {review.schoolName}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
