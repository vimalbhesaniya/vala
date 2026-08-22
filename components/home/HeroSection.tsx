"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/common/Button";
import { useActiveBanner } from "@/hooks/use-site-config";
import { HERO_IMAGE } from "@/lib/constants/demo-data";

export function HeroSection() {
  const { banner } = useActiveBanner("homepage_hero");

  const title = banner?.title ?? "Back to school, but make it beautiful.";
  const subtitle =
    banner?.subtitle ?? "Premium uniforms made for every school day.";
  const cta = banner?.cta ?? "Shop Uniforms";
  const href = banner?.href ?? "/shop";
  const image = banner?.image ?? HERO_IMAGE;

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[70vh] items-center gap-8 py-12 lg:grid-cols-2 lg:gap-12 lg:py-16">
          <div className="relative z-10 order-2 animate-fade-in-up lg:order-1">
            <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
              Premium School Uniforms
            </p>
            <h1 className="mt-4 text-[40px] leading-[1.1] font-medium tracking-tight text-primary sm:text-[52px] lg:text-[64px]">
              {title}
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              {subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link href={href}>
                <Button variant="primary" size="lg">
                  {cta}
                </Button>
              </Link>
              <Link href="/schools">
                <Button variant="outline" size="lg">
                  Find Your School
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-3xl lg:order-2 lg:aspect-[3/4] lg:min-h-[520px]">
            <Image
              src={image}
              alt={title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
