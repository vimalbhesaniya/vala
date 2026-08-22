import { HeroSection } from "@/components/home/HeroSection";
import { SchoolSelector } from "@/components/school/SchoolSelector";
import { CategorySection } from "@/components/home/CategorySection";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { PromoBannerSection } from "@/components/home/PromoBannerSection";
import { UniformSetSection } from "@/components/home/UniformSetSection";
import { ShopBySchoolSection } from "@/components/home/ShopBySchoolSection";
import { WhyValaSection } from "@/components/home/WhyValaSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SchoolSelector />
      <CategorySection />
      <BestSellersSection />
      <PromoBannerSection />
      <UniformSetSection />
      <ShopBySchoolSection />
      <WhyValaSection />
      <ReviewsSection />
      <NewsletterSection />
    </>
  );
}
