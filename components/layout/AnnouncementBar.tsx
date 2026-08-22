"use client";

import Link from "next/link";
import { useActiveBanner, useSiteSettings } from "@/hooks/use-site-config";

export function AnnouncementBar() {
  const { banner } = useActiveBanner("announcement");
  const { data: settings } = useSiteSettings();

  const message = banner
    ? `${banner.title}${banner.subtitle ? ` · ${banner.subtitle}` : ""}`
    : `FREE DELIVERY ON ORDERS ABOVE ₹${settings?.shipping.freeThreshold ?? 999}`;

  const href = banner?.href;

  return (
    <div className="bg-primary text-center text-white">
      {href ? (
        <Link
          href={href}
          className="block px-4 py-2.5 text-[11px] font-medium tracking-[0.15em] uppercase sm:text-xs hover:underline"
        >
          {message}
        </Link>
      ) : (
        <p className="px-4 py-2.5 text-[11px] font-medium tracking-[0.15em] uppercase sm:text-xs">
          {message}
        </p>
      )}
    </div>
  );
}
