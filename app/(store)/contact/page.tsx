"use client";

import { useState } from "react";
import { ContentPage } from "@/components/layout/ContentPage";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useToast } from "@/components/providers/toast-provider";
import { useSiteSettings } from "@/hooks/use-site-config";

export default function ContactPage() {
  const { toast } = useToast();
  const { data: settings } = useSiteSettings();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    toast("Message sent! We'll get back to you within 24 hours.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <ContentPage
      title="Contact Us"
      description="We're here to help with orders, sizing, and school queries."
    >
      <section>
        <h2>Get in Touch</h2>
        <p>
          Email us at{" "}
          <strong className="text-foreground">{settings?.store.email ?? "hello@valauniforms.com"}</strong>{" "}
          or call{" "}
          <strong className="text-foreground">{settings?.store.phone ?? "+91 40 1234 5678"}</strong>.
        </p>
        {settings?.store.address && (
          <p className="mt-2 text-sm text-muted">{settings.store.address}</p>
        )}
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-border bg-surface p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-xs text-muted">
              Name
            </label>
            <Input id="name" name="name" required placeholder="Your name" />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-xs text-muted">
              Email
            </label>
            <Input id="email" name="email" type="email" required placeholder="you@email.com" />
          </div>
        </div>
        <div>
          <label htmlFor="subject" className="mb-2 block text-xs text-muted">
            Subject
          </label>
          <Input id="subject" name="subject" required placeholder="How can we help?" />
        </div>
        <div>
          <label htmlFor="message" className="mb-2 block text-xs text-muted">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="Tell us more..."
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </ContentPage>
  );
}
