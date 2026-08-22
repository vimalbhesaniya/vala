"use client";

import Link from "next/link";
import { Button } from "@/components/common/Button";
import { useActiveBanner } from "@/hooks/use-site-config";

export function PromoBannerSection() {
  const { banner } = useActiveBanner("homepage_mid");

  if (!banner) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-primary px-8 py-10 text-white shadow-soft sm:px-12">
        <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">Featured</p>
        <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{banner.title}</h2>
        {banner.subtitle && <p className="mt-2 max-w-2xl text-sm text-white/80">{banner.subtitle}</p>}
        <Link href={banner.href} className="mt-6 inline-block">
          <Button variant="secondary" size="md">
            {banner.cta}
          </Button>
        </Link>
      </div>
    </section>
  );
}
