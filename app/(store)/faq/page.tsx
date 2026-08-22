import { ContentPage } from "@/components/layout/ContentPage";
import { Accordion } from "@/components/common/Accordion";

const FAQ_ITEMS = [
  {
    id: "ordering",
    title: "How do I place an order?",
    content:
      "Select your school, browse approved uniforms, choose size and quantity, then add to cart. Proceed to checkout with your delivery address and payment method.",
  },
  {
    id: "sizing",
    title: "How do I choose the right size?",
    content:
      "Use our Size Guide with body measurements. When in doubt, size up for growing children. Exchanges for unused items are available within 7 days.",
  },
  {
    id: "delivery",
    title: "How long does delivery take?",
    content:
      "Standard delivery takes 3–5 business days. Express delivery (1–2 days) is available for ₹149. Free delivery applies on orders above ₹999.",
  },
  {
    id: "exchange",
    title: "Can I exchange items?",
    content:
      "Yes. Unused items with tags can be exchanged within 7 days. Your first size exchange is free. Visit our Returns page for full details.",
  },
  {
    id: "school",
    title: "What if my school isn't listed?",
    content:
      "Contact us with your school name and we'll work to add approved collections. Many schools join VALA each academic season.",
  },
  {
    id: "payment",
    title: "What payment methods do you accept?",
    content:
      "We accept Cash on Delivery (COD) and online payment. Online payment is currently in demo mode for this storefront.",
  },
];

export default function FAQPage() {
  return (
    <ContentPage
      title="FAQ"
      description="Answers to common questions about ordering, sizing, and delivery."
      wide
    >
      <Accordion items={FAQ_ITEMS} />
    </ContentPage>
  );
}
