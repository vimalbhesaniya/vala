"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { CartSummary, getCartTotals } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/common/EmptyState";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useAddresses } from "@/hooks/use-api";
import { useSiteSettings } from "@/hooks/use-site-config";
import { ordersApi } from "@/lib/api/services";
import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils/cn";
import type { DeliveryMethod, PaymentMethod } from "@/types/order";

const emptyGuestAddress = {
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, subtotal, clearCart } = useCartStore();
  const { user, token } = useAuthStore();
  const isAuth = !!token;

  const { data: addresses = [], isLoading: addressesLoading } = useAddresses(isAuth);
  const { data: siteSettings } = useSiteSettings();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [guestAddress, setGuestAddress] = useState(emptyGuestAddress);
  const [guestEmail, setGuestEmail] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (user && !guestAddress.name) {
      setGuestAddress((prev) => ({
        ...prev,
        name: user.name,
        phone: user.phone ?? prev.phone,
      }));
      setGuestEmail(user.email);
    }
  }, [user, guestAddress.name]);

  const cartSubtotal = subtotal();
  const standardTotals = getCartTotals(cartSubtotal, 0, siteSettings, "standard");
  const expressTotals = getCartTotals(cartSubtotal, 0, siteSettings, "express");
  const shipping =
    deliveryMethod === "express" ? expressTotals.shipping : standardTotals.shipping;
  const tax = siteSettings?.tax.gstEnabled
    ? Math.round(cartSubtotal * ((siteSettings.tax.gstRate ?? 5) / 100))
    : standardTotals.tax;
  const orderTotal = cartSubtotal + shipping + tax;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const getDeliveryAddress = () => {
    if (isAuth && selectedAddress) {
      return {
        name: selectedAddress.name,
        line1: selectedAddress.line1,
        line2: selectedAddress.line2,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        phone: selectedAddress.phone,
      };
    }
    return {
      name: guestAddress.name,
      line1: guestAddress.line1,
      line2: guestAddress.line2 || undefined,
      city: guestAddress.city,
      state: guestAddress.state,
      pincode: guestAddress.pincode,
      phone: guestAddress.phone,
    };
  };

  const placeOrder = async () => {
    const address = getDeliveryAddress();
    const customerName = user?.name ?? guestAddress.name;
    const customerEmail = user?.email ?? guestEmail;
    const customerPhone = user?.phone ?? guestAddress.phone;

    if (!customerName || !customerEmail || !customerPhone || !address.line1) {
      toast("Please fill in all required delivery details", "error");
      return;
    }

    setPlacing(true);
    try {
      const res = await ordersApi.create({
        customerName,
        customerEmail,
        customerPhone,
        items: items.map((item) => ({
          productId: item.productId,
          productSlug: item.productSlug,
          name: item.name,
          image: item.image,
          schoolName: item.schoolName,
          size: item.size,
          sku: item.sku,
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethod,
        deliveryMethod,
        subtotal: cartSubtotal,
        discount: 0,
        shipping,
        tax,
        total: orderTotal,
        address,
      });

      if (typeof window !== "undefined") {
        sessionStorage.setItem("vala-last-order-email", customerEmail);
      }

      clearCart();
      router.push(`/checkout/success?order=${res.data.orderNumber}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to place order", "error");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Checkout" }]} />
        <PageHeader title="Checkout" />
        <EmptyState
          title="Nothing to checkout"
          description="Your cart is empty. Add items before checking out."
          actionLabel="Shop Now"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <PageHeader title="Checkout" description="Review your order and complete purchase." />

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold tracking-wider text-primary uppercase">
              Delivery Address
            </h2>

            {isAuth ? (
              addressesLoading ? (
                <div className="mt-4 h-32 animate-pulse rounded-xl bg-border/40" />
              ) : addresses.length === 0 ? (
                <div className="mt-4">
                  <p className="text-sm text-muted">No saved addresses yet.</p>
                  <Link href="/account/addresses" className="mt-2 inline-block text-xs text-accent hover:underline">
                    Add an address
                  </Link>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={cn(
                        "flex cursor-pointer gap-4 rounded-xl border p-4 transition-colors",
                        selectedAddressId === addr.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/20"
                      )}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 accent-primary"
                      />
                      <div>
                        <p className="text-sm font-medium capitalize text-foreground">
                          {addr.label} {addr.isDefault && <span className="text-xs text-accent">· Default</span>}
                        </p>
                        <p className="mt-1 text-sm text-muted">{addr.name}</p>
                        <p className="text-sm text-muted">
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                        <p className="text-sm text-muted">{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )
            ) : (
              <div className="mt-4 space-y-4">
                <p className="text-sm text-muted">
                  <Link href="/account/profile" className="text-accent hover:underline">Sign in</Link> to use saved addresses, or enter details below.
                </p>
                <Input
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Email address"
                  type="email"
                />
                {(["name", "line1", "line2", "city", "state", "pincode", "phone"] as const).map((field) => (
                  <Input
                    key={field}
                    value={guestAddress[field]}
                    onChange={(e) => setGuestAddress({ ...guestAddress, [field]: e.target.value })}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  />
                ))}
              </div>
            )}

            {isAuth && (
              <Link href="/account/addresses" className="mt-4 inline-block text-xs text-accent hover:underline">
                Manage addresses
              </Link>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold tracking-wider text-primary uppercase">
              Delivery Method
            </h2>
            <div className="mt-4 space-y-3">
              {[
                { value: "standard" as const, label: "Standard Delivery", desc: `3–5 business days · Free above ₹${siteSettings?.shipping.freeThreshold ?? 999}`, price: standardTotals.shipping === 0 && deliveryMethod === "standard" ? "Free" : `₹${siteSettings?.shipping.standardRate ?? 99}` },
                { value: "express" as const, label: "Express Delivery", desc: "1–2 business days", price: `₹${siteSettings?.shipping.expressRate ?? 149}` },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors",
                    deliveryMethod === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === opt.value}
                      onChange={() => setDeliveryMethod(opt.value)}
                      className="accent-primary"
                    />
                    <div>
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className="text-xs text-muted">{opt.desc}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{opt.price}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold tracking-wider text-primary uppercase">
              Payment Method
            </h2>
            <div className="mt-4 space-y-3">
              {[
                ...(siteSettings?.payments.codEnabled !== false
                  ? [{ value: "cod" as const, label: "Cash on Delivery", desc: "Pay when your order arrives" }]
                  : []),
                ...(siteSettings?.payments.onlineEnabled !== false
                  ? [{ value: "mock_online" as const, label: "Pay Online (Demo)", desc: "Simulated payment — no charge" }]
                  : []),
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer gap-4 rounded-xl border p-4 transition-colors",
                    paymentMethod === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/20"
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === opt.value}
                    onChange={() => setPaymentMethod(opt.value)}
                    className="mt-1 accent-primary"
                  />
                  <div>
                    <p className="text-sm font-medium">{opt.label}</p>
                    <p className="text-xs text-muted">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold text-primary">Order Summary</h2>
            <ul className="mt-4 space-y-3 border-b border-border pb-4">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span className="truncate pr-4 text-muted">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="shrink-0 font-medium">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <CartSummary
                subtotal={cartSubtotal}
                shipping={shipping}
                tax={tax}
                showDeliveryProgress={false}
              />
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={placing || (isAuth && addresses.length === 0)}
            onClick={placeOrder}
          >
            {placing ? "Placing Order..." : `Place Order · ₹${orderTotal.toLocaleString("en-IN")}`}
          </Button>

          <Link href="/cart" className="block text-center text-xs text-muted hover:text-foreground">
            ← Back to cart
          </Link>
        </div>
      </div>
    </div>
  );
}
