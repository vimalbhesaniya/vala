import { ContentPage } from "@/components/layout/ContentPage";

export default function ReturnsPage() {
  return (
    <ContentPage
      title="Returns & Exchanges"
      description="Our hassle-free return and exchange policy."
    >
      <section>
        <h2>7-Day Exchange Policy</h2>
        <p>
          Unused items with original tags and packaging may be exchanged within 7 days of delivery.
          Your first size exchange is complimentary.
        </p>
      </section>
      <section>
        <h2>Eligible Items</h2>
        <ul>
          <li>Uniforms, shoes, and accessories in unworn condition</li>
          <li>Items with VALA tags attached</li>
          <li>Products without stains, damage, or alterations</li>
        </ul>
      </section>
      <section>
        <h2>How to Initiate</h2>
        <p>
          Contact support@vala.in with your order number, or visit your account orders page.
          Our team will arrange pickup or provide return instructions.
        </p>
      </section>
      <section>
        <h2>Refunds</h2>
        <p>
          Refunds for eligible returns are processed within 5–7 business days to your original
          payment method. COD orders receive bank transfer refunds.
        </p>
      </section>
    </ContentPage>
  );
}
