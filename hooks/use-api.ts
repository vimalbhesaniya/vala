import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { catalogApi, ordersApi, addressesApi, adminApi } from "@/lib/api/services";
import type { BulkRequest, BulkResource } from "@/lib/admin/bulk";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { DEFAULT_SITE_SETTINGS } from "@/lib/constants/default-site-config";
import { productKeys, schoolKeys, categoryKeys, orderKeys } from "@/lib/query/keys";
import type { ProductQueryParams } from "@/lib/api/services";

export function useSchools(params?: { city?: string; state?: string; q?: string }) {
  return useQuery({
    queryKey: [...schoolKeys.lists(), params],
    queryFn: async () => (await catalogApi.getSchools(params)).data,
  });
}

export function useSchool(slug: string) {
  return useQuery({
    queryKey: schoolKeys.detail(slug),
    queryFn: async () => (await catalogApi.getSchool(slug)).data,
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: async () => (await catalogApi.getCategories()).data,
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: async () => (await catalogApi.getCategory(slug)).data,
    enabled: !!slug,
  });
}

export function useProducts(params: ProductQueryParams, enabled = true) {
  return useQuery({
    queryKey: productKeys.list(params as Record<string, unknown>),
    queryFn: async () => (await catalogApi.getProducts(params)).data,
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: async () => (await catalogApi.getProduct(slug)).data,
    enabled: !!slug,
  });
}

export function useReviews(productSlug?: string) {
  return useQuery({
    queryKey: ["reviews", productSlug ?? "all"],
    queryFn: async () => (await catalogApi.getReviews(productSlug)).data,
  });
}

export function useUniformSets(schoolSlug?: string) {
  return useQuery({
    queryKey: ["uniform-sets", schoolSlug ?? "all"],
    queryFn: async () => (await catalogApi.getUniformSets(schoolSlug)).data,
  });
}

export function useOrders(enabled = true) {
  return useQuery({
    queryKey: orderKeys.lists(),
    queryFn: async () => (await ordersApi.list()).data,
    enabled,
  });
}

export function useOrder(id: string, enabled = true) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => (await ordersApi.get(id)).data,
    enabled: enabled && !!id,
  });
}

export function useAddresses(enabled = true) {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: async () => (await addressesApi.list()).data,
    enabled,
  });
}

export function useAdminOrders(enabled = true) {
  const { isAuthenticated, isReady } = useAdminAuth();
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => (await ordersApi.adminList()).data,
    enabled: enabled && isReady && isAuthenticated,
  });
}

export function useAddressMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["addresses"] });

  return {
    create: useMutation({
      mutationFn: addressesApi.create,
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, body }: { id: string; body: Partial<Parameters<typeof addressesApi.update>[1]> }) =>
        addressesApi.update(id, body),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: addressesApi.remove,
      onSuccess: invalidate,
    }),
  };
}

export function useAdminDashboard(enabled = true) {
  const { isAuthenticated, isReady } = useAdminAuth();
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => (await adminApi.getDashboard()).data,
    enabled: enabled && isReady && isAuthenticated,
  });
}

export function useAdminInventory(enabled = true) {
  const { isAuthenticated, isReady } = useAdminAuth();
  return useQuery({
    queryKey: ["admin", "inventory"],
    queryFn: async () => (await adminApi.getInventory()).data,
    enabled: enabled && isReady && isAuthenticated,
  });
}

export function useAdminCustomers(enabled = true) {
  const { isAuthenticated, isReady } = useAdminAuth();
  return useQuery({
    queryKey: ["admin", "customers"],
    queryFn: async () => (await adminApi.getCustomers()).data,
    enabled: enabled && isReady && isAuthenticated,
  });
}

export function useAdminCoupons(enabled = true) {
  const { isAuthenticated, isReady } = useAdminAuth();
  return useQuery({
    queryKey: ["admin", "coupons"],
    queryFn: async () => (await adminApi.getCoupons()).data,
    enabled: enabled && isReady && isAuthenticated,
  });
}

export function useAdminReviews(enabled = true) {
  const { isAuthenticated, isReady } = useAdminAuth();
  return useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: async () => (await adminApi.getReviews()).data,
    enabled: enabled && isReady && isAuthenticated,
  });
}

export function useAdminProducts(enabled = true) {
  const { isAuthenticated, isReady } = useAdminAuth();
  return useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => (await adminApi.getProducts()).data,
    enabled: enabled && isReady && isAuthenticated,
  });
}

export function useAdminProduct(id: string, enabled = true) {
  const { isAuthenticated, isReady } = useAdminAuth();
  return useQuery({
    queryKey: ["admin", "products", id],
    queryFn: async () => (await adminApi.getProduct(id)).data,
    enabled: enabled && isReady && isAuthenticated && !!id,
  });
}

export function useAdminSettings(enabled = true) {
  const { isAuthenticated, isReady } = useAdminAuth();
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => (await adminApi.getSettings()).data,
    enabled: enabled && isReady && isAuthenticated,
    placeholderData: DEFAULT_SITE_SETTINGS,
  });
}

export function useAdminBanners(enabled = true) {
  const { isAuthenticated, isReady } = useAdminAuth();
  return useQuery({
    queryKey: ["admin", "banners"],
    queryFn: async () => (await adminApi.getBanners()).data,
    enabled: enabled && isReady && isAuthenticated,
  });
}

export function useAdminCategories(enabled = true) {
  const { isAuthenticated, isReady } = useAdminAuth();
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => (await adminApi.getCategories()).data,
    enabled: enabled && isReady && isAuthenticated,
  });
}

export function useOrderMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: orderKeys.all });
    qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
  };

  return {
    updateStatus: useMutation({
      mutationFn: ({ id, status }: { id: string; status: string }) =>
        ordersApi.updateStatus(id, status),
      onSuccess: invalidate,
    }),
    deleteOrder: useMutation({
      mutationFn: ordersApi.delete,
      onSuccess: invalidate,
    }),
  };
}

export function useAdminMutations() {
  const qc = useQueryClient();

  return {
    updateStock: useMutation({
      mutationFn: adminApi.updateStock,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["admin", "inventory"] });
        qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      },
    }),
    createCoupon: useMutation({
      mutationFn: adminApi.createCoupon,
      onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "coupons"] }),
    }),
    updateCoupon: useMutation({
      mutationFn: ({ id, body }: { id: string; body: { status?: string } }) =>
        adminApi.updateCoupon(id, body),
      onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "coupons"] }),
    }),
    deleteCoupon: useMutation({
      mutationFn: adminApi.deleteCoupon,
      onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "coupons"] }),
    }),
    updateReview: useMutation({
      mutationFn: ({ id, body }: { id: string; body: { status: string } }) =>
        adminApi.updateReview(id, body),
      onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "reviews"] }),
    }),
    deleteReview: useMutation({
      mutationFn: adminApi.deleteReview,
      onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "reviews"] }),
    }),
    createProduct: useMutation({
      mutationFn: adminApi.createProduct,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["admin", "products"] });
        qc.invalidateQueries({ queryKey: productKeys.lists() });
      },
    }),
    updateProduct: useMutation({
      mutationFn: ({ id, body }: { id: string; body: unknown }) =>
        adminApi.updateProduct(id, body),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["admin", "products"] });
        qc.invalidateQueries({ queryKey: productKeys.lists() });
      },
    }),
    deleteProduct: useMutation({
      mutationFn: adminApi.deleteProduct,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["admin", "products"] });
        qc.invalidateQueries({ queryKey: productKeys.lists() });
      },
    }),
    updateSettings: useMutation({
      mutationFn: adminApi.updateSettings,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["admin", "settings"] });
        qc.invalidateQueries({ queryKey: ["site-settings"] });
      },
    }),
    createBanner: useMutation({
      mutationFn: adminApi.createBanner,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["admin", "banners"] });
        qc.invalidateQueries({ queryKey: ["banners"] });
      },
    }),
    updateBanner: useMutation({
      mutationFn: ({ id, body }: { id: string; body: unknown }) =>
        adminApi.updateBanner(id, body),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["admin", "banners"] });
        qc.invalidateQueries({ queryKey: ["banners"] });
      },
    }),
    deleteBanner: useMutation({
      mutationFn: adminApi.deleteBanner,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["admin", "banners"] });
        qc.invalidateQueries({ queryKey: ["banners"] });
      },
    }),
    createCategory: useMutation({
      mutationFn: adminApi.createCategory,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["admin", "categories"] });
        qc.invalidateQueries({ queryKey: categoryKeys.lists() });
      },
    }),
    updateCategory: useMutation({
      mutationFn: ({ id, body }: { id: string; body: unknown }) =>
        adminApi.updateCategory(id, body),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["admin", "categories"] });
        qc.invalidateQueries({ queryKey: categoryKeys.lists() });
      },
    }),
    deleteCategory: useMutation({
      mutationFn: adminApi.deleteCategory,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["admin", "categories"] });
        qc.invalidateQueries({ queryKey: categoryKeys.lists() });
      },
    }),
  };
}

const BULK_INVALIDATION: Record<BulkResource, string[][]> = {
  products: [["admin", "products"], ["products"]],
  orders: [["admin", "orders"], ["orders"], ["admin", "dashboard"]],
  categories: [["admin", "categories"], ["categories"]],
  coupons: [["admin", "coupons"]],
  banners: [["admin", "banners"], ["banners"]],
  reviews: [["admin", "reviews"]],
  inventory: [["admin", "inventory"], ["admin", "dashboard"]],
};

export function useBulkAction(resource: BulkResource) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: Omit<BulkRequest, "resource">) =>
      adminApi.bulk({ resource, ...body }),
    onSuccess: () => {
      for (const key of BULK_INVALIDATION[resource]) {
        qc.invalidateQueries({ queryKey: key });
      }
    },
  });
}
