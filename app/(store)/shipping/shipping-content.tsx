"use client";

import { ContentPage } from "@/components/layout/ContentPage";
import { useSiteSettings } from "@/hooks/use-site-config";

export function ShippingContent() {
  const { data: settings } = useSiteSettings();
  const freeThreshold = settings?.shipping.freeThreshold ?? 999;
  const standardRate = settings?.shipping.standardRate ?? 99;
  const expressRate = settings?.shipping.expressRate ?? 149;
  const processingDays = settings?.shipping.processingDays ?? 2;

  return (
    <ContentPage
      title="Shipping"
      description="Delivery options and timelines for your VALA order."
    >
      <section>
        <h2>Delivery Options</h2>
        <ul>
          <li>
            <strong className="text-foreground">Standard Delivery</strong> — 3–5 business days
            (₹{standardRate}, free above ₹{freeThreshold})
          </li>
          <li>
            <strong className="text-foreground">Express Delivery</strong> — 1–2 business days
            (₹{expressRate})
          </li>
        </ul>
      </section>
      <section>
        <h2>Order Processing</h2>
        <p>
          Orders are typically processed within {processingDays} business day
          {processingDays !== 1 ? "s" : ""}. You will receive tracking details once your order
          ships.
        </p>
      </section>
      <section>
        <h2>Service Areas</h2>
        <p>
          We deliver across major cities in India. Remote pin codes may require an additional
          1–2 days. Enter your pincode at checkout to confirm availability.
        </p>
      </section>
    </ContentPage>
  );
}
