import { ContentPage } from "@/components/layout/ContentPage";

export default function PrivacyPage() {
  return (
    <ContentPage title="Privacy Policy" description="Last updated: August 2025">
      <section>
        <h2>Information We Collect</h2>
        <p>
          We collect information you provide when creating an account, placing orders, or
          contacting support — including name, email, phone, delivery address, and order history.
        </p>
      </section>
      <section>
        <h2>How We Use Your Data</h2>
        <ul>
          <li>Process and deliver your orders</li>
          <li>Send order updates and support communications</li>
          <li>Improve our products and shopping experience</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>
      <section>
        <h2>Data Security</h2>
        <p>
          We use industry-standard measures to protect your personal information. Payment
          details are processed through secure, PCI-compliant providers.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          For privacy-related questions, email privacy@vala.in.
        </p>
      </section>
    </ContentPage>
  );
}
