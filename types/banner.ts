export type BannerPlacement = "homepage_hero" | "homepage_mid" | "announcement";
export type BannerStatus = "active" | "draft" | "scheduled";

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  placement: BannerPlacement;
  status: BannerStatus;
  image?: string;
  startsAt: string;
  endsAt?: string;
}
