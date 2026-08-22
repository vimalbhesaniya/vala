import { ContentPage } from "@/components/layout/ContentPage";

export default function TermsPage() {
  return (
    <ContentPage title="Terms of Service" description="Last updated: August 2025">
      <section>
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing or using the VALA website and services, you agree to these Terms of Service.
          If you do not agree, please do not use our platform.
        </p>
      </section>
      <section>
        <h2>Products & Pricing</h2>
        <p>
          All products are subject to availability. Prices are listed in Indian Rupees (INR) and
          may change without notice. School-specific collections reflect approved specifications.
        </p>
      </section>
      <section>
        <h2>Orders & Payment</h2>
        <p>
          Placing an order constitutes an offer to purchase. We reserve the right to cancel orders
          due to stock unavailability, pricing errors, or suspected fraud.
        </p>
      </section>
      <section>
        <h2>Limitation of Liability</h2>
        <p>
          VALA is not liable for indirect or consequential damages arising from use of our
          services, to the maximum extent permitted by applicable law.
        </p>
      </section>
    </ContentPage>
  );
}
