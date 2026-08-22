import { Sparkles, Ruler, RefreshCw, Truck } from "lucide-react";
import { WHY_VALA } from "@/lib/constants/site";

const icons = {
  sparkles: Sparkles,
  ruler: Ruler,
  refresh: RefreshCw,
  truck: Truck,
};

export function WhyValaSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-[28px] font-medium tracking-tight text-primary sm:text-[40px]">
            Why VALA
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted sm:text-base">
            We make school uniform shopping simple, beautiful, and stress-free
            for every family.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_VALA.map((item) => {
            const Icon = icons[item.icon];
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:border-primary/20 hover:shadow-soft"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mt-5 text-base font-medium text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
