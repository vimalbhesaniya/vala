import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/constants/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="text-2xl font-semibold tracking-[0.2em] text-primary"
            >
              VALA
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Premium school uniforms made for every school day. Shop by school,
              find your perfect fit, and dress with confidence.
            </p>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.15em] text-primary uppercase">
              Shop
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer care */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.15em] text-primary uppercase">
              Customer Care
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.customerCare.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.15em] text-primary uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} VALA. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            Made with care for students everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
