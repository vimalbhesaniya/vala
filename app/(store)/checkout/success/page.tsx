import { Suspense } from "react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CheckoutSuccessContent } from "./success-content";

function SuccessFallback() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Order Confirmed" }]} />
      <div className="mt-10 h-40 animate-pulse rounded-2xl bg-border/40" />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
