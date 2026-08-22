import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "@/lib/api/services";
import { DEFAULT_SITE_SETTINGS } from "@/lib/constants/default-site-config";
import type { SiteSettings } from "@/types/site-settings";

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => (await catalogApi.getSettings()).data,
    staleTime: 5 * 60 * 1000,
    placeholderData: DEFAULT_SITE_SETTINGS as SiteSettings,
  });
}

export function useBanners(placement?: string) {
  return useQuery({
    queryKey: ["banners", placement ?? "all"],
    queryFn: async () => (await catalogApi.getBanners(placement)).data,
    staleTime: 5 * 60 * 1000,
  });
}

export function useActiveBanner(placement: string) {
  const { data: banners = [], ...rest } = useBanners(placement);
  return { banner: banners[0] ?? null, ...rest };
}
