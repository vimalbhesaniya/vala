"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { School } from "@/types/school";

interface SchoolCardProps {
  school: School;
  onSelect?: (school: School) => void;
  variant?: "default" | "compact";
  className?: string;
}

export function SchoolCard({
  school,
  onSelect,
  variant = "default",
  className,
}: SchoolCardProps) {
  const content = (
    <>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f5f4f1]",
          variant === "compact" ? "h-12 w-12" : "h-14 w-14"
        )}
      >
        <Image
          src={school.logo}
          alt={`${school.name} logo`}
          width={56}
          height={56}
          className="h-full w-full object-contain p-2"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3
          className={cn(
            "truncate font-medium text-foreground",
            variant === "compact" ? "text-sm" : "text-base"
          )}
        >
          {school.name}
        </h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">
            {school.city}, {school.state}
          </span>
        </p>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
    </>
  );

  const baseClass = cn(
    "group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-all duration-200 hover:border-primary/20 hover:shadow-card",
    className
  );

  if (onSelect) {
    return (
      <button type="button" onClick={() => onSelect(school)} className={cn(baseClass, "w-full text-left")}>
        {content}
      </button>
    );
  }

  return (
    <Link href={`/schools/${school.slug}`} className={baseClass}>
      {content}
    </Link>
  );
}
