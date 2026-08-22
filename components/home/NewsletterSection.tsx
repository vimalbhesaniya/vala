"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center sm:px-16 sm:py-20">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent/5" />

          <div className="relative z-10 mx-auto max-w-xl">
            <h2 className="text-[28px] font-medium tracking-tight text-white sm:text-[36px]">
              Stay in the loop
            </h2>
            <p className="mt-3 text-sm text-white/70 sm:text-base">
              Get early access to new collections, school partnerships, and
              exclusive offers.
            </p>

            {submitted ? (
              <p className="mt-8 text-sm font-medium text-accent">
                Thank you! You&apos;re on the list.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-2"
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-0 bg-white/10 text-white placeholder:text-white/50 focus:border-white/30 sm:flex-1"
                  aria-label="Email address"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  className="shrink-0"
                >
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
