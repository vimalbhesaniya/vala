import { ContentPage } from "@/components/layout/ContentPage";

export default function AboutPage() {
  return (
    <ContentPage
      title="About VALA"
      description="Premium school uniforms, delivered with care."
    >
      <section>
        <h2>Our Story</h2>
        <p>
          VALA was founded with a simple mission: make school uniform shopping effortless
          for parents while delivering premium quality that stands up to daily school life.
          We partner with schools across India to offer approved collections in one trusted place.
        </p>
      </section>
      <section>
        <h2>What We Stand For</h2>
        <ul>
          <li>Premium fabrics and durable construction</li>
          <li>School-approved designs and colours</li>
          <li>Easy sizing with helpful guides</li>
          <li>Reliable doorstep delivery and hassle-free exchanges</li>
        </ul>
      </section>
      <section>
        <h2>Trusted by Families</h2>
        <p>
          Thousands of parents rely on VALA every academic year. From first-day shirts to
          complete uniform sets, we help families get ready with confidence.
        </p>
      </section>
    </ContentPage>
  );
}
