"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { NAV_LINKS } from "@/lib/constants/site";
import { useCartStore } from "@/store/cart-store";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openDrawer } = useCartStore();
  const count = itemCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border/80 bg-background/85 backdrop-blur-md"
            : "border-b border-transparent bg-background"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/5 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold tracking-[0.2em] text-primary lg:static lg:translate-x-0 lg:text-2xl"
          >
            VALA
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-foreground/80 transition-colors duration-200 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/search"
              className="hidden h-10 w-10 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/5 sm:flex"
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px]" />
            </Link>
            <Link
              href="/account"
              className="hidden h-10 w-10 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/5 md:flex"
              aria-label="Account"
            >
              <User className="h-[18px] w-[18px]" />
            </Link>
            <Link
              href="/account/wishlist"
              className="hidden h-10 w-10 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/5 md:flex"
              aria-label="Wishlist"
            >
              <Heart className="h-[18px] w-[18px]" />
            </Link>
            <button
              type="button"
              onClick={openDrawer}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/5"
              aria-label="Cart"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu overlay"
          />
          <nav
            className="animate-slide-in-right absolute inset-y-0 left-0 w-[min(320px,85vw)] bg-surface shadow-elevated"
            aria-label="Mobile"
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <span className="text-lg font-semibold tracking-[0.15em]">VALA</span>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-primary/5"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-1 p-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-4 py-3 text-base text-foreground transition-colors hover:bg-primary/5"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-3 border-border" />
              <Link
                href="/account"
                className="rounded-lg px-4 py-3 text-base text-foreground transition-colors hover:bg-primary/5"
                onClick={() => setMobileOpen(false)}
              >
                Account
              </Link>
              <Link
                href="/account/wishlist"
                className="rounded-lg px-4 py-3 text-base text-foreground transition-colors hover:bg-primary/5"
                onClick={() => setMobileOpen(false)}
              >
                Wishlist
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
