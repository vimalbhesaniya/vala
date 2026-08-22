import { ContentPage } from "@/components/layout/ContentPage";

export default function RefundPolicyPage() {
  return (
    <ContentPage title="Refund Policy" description="How refunds are processed at VALA">
      <section>
        <h2>Refund Eligibility</h2>
        <p>
          Refunds are available for returned items that meet our return policy criteria.
          Exchanges are preferred for sizing issues; refunds apply when an exchange is not possible.
        </p>
      </section>
      <section>
        <h2>Processing Time</h2>
        <p>
          Once we receive and inspect your return, refunds are initiated within 3 business days
          and credited within 5–7 business days depending on your bank or payment provider.
        </p>
      </section>
      <section>
        <h2>COD Orders</h2>
        <p>
          For Cash on Delivery orders, refunds are processed via bank transfer. You will be
          asked to provide account details after return approval.
        </p>
      </section>
      <section>
        <h2>Non-Refundable Items</h2>
        <ul>
          <li>Worn or washed items</li>
          <li>Items without original tags</li>
          <li>Custom or monogrammed products (unless defective)</li>
        </ul>
      </section>
    </ContentPage>
  );
}
