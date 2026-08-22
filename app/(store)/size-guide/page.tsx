import { ContentPage } from "@/components/layout/ContentPage";
import { SizeGuideContent } from "@/components/product/SizeGuideContent";

export default function SizeGuidePage() {
  return (
    <ContentPage
      title="Size Guide"
      description="Find the perfect fit with our measurement charts and tips."
      wide
    >
      <SizeGuideContent />
    </ContentPage>
  );
}
