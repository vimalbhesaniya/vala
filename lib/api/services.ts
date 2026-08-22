import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api/client";
import type { School } from "@/types/school";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import type { Review } from "@/types/review";
import type { Order } from "@/types/order";
import type { Address } from "@/types/address";
import type { UniformSet } from "@/types/uniform-set";
import type { SiteSettings } from "@/types/site-settings";
import type { Banner } from "@/types/banner";

export type PaginatedProducts = {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ProductQueryParams = Record<string, string | number | boolean | undefined>;

export const catalogApi = {
  getSchools: (params?: { city?: string; state?: string; q?: string }) =>
    apiGet<School[]>("/schools", params),

  getSchool: (slug: string) => apiGet<School>(`/schools/${slug}`),

  getCategories: () => apiGet<Category[]>("/categories"),

  getCategory: (slug: string) => apiGet<Category>(`/categories/${slug}`),

  getProducts: (params?: ProductQueryParams) =>
    apiGet<PaginatedProducts>("/products", params),

  getProduct: (slug: string) => apiGet<Product>(`/products/${slug}`),

  getReviews: (productSlug?: string) =>
    apiGet<Review[]>("/reviews", productSlug ? { product: productSlug } : undefined),

  getUniformSets: (schoolSlug?: string) =>
    apiGet<UniformSet[]>("/uniform-sets", schoolSlug ? { school: schoolSlug } : undefined),

  validateCoupon: (code: string, total: number) =>
    apiGet<{ discountAmount: number; code: string }>("/coupons/validate", {
      code,
      total,
    }),

  getSettings: () => apiGet<SiteSettings>("/settings"),

  getBanners: (placement?: string) =>
    apiGet<Banner[]>("/banners", placement ? { placement } : undefined),
};

export const ordersApi = {
  list: () => apiGet<Order[]>("/orders"),

  get: (id: string) => apiGet<Order>(`/orders/${id}`),

  create: (body: unknown) => apiPost<Order>("/orders", body),

  track: (orderNumber: string, email: string) =>
    apiPost<Order>("/orders/track", { orderNumber, email }),

  updateStatus: (id: string, status: string) =>
    apiPatch<Order>(`/orders/${id}`, { status }),

  delete: (id: string) => apiDelete<{ id: string }>(`/orders/${id}`),

  adminList: () => apiGet<Order[]>("/admin/orders"),
};

export type AdminDashboardData = {
  stats: { id: string; label: string; value: string; change?: number; changeLabel?: string }[];
  orderStatusCounts: { status: string; label: string; count: number; color: string }[];
  topProducts: { id: string; name: string; schoolName: string; unitsSold: number; revenue: number; image: string }[];
  topSchools: { id: string; name: string; city: string; orders: number; revenue: number; logo: string }[];
  lowStockItems: { id: string; productName: string; sku: string; size: string; schoolName: string; stock: number; threshold: number }[];
  recentOrders: { id: string; orderNumber: string; customerName: string; schoolName: string; total: number; status: string; createdAt: string; itemCount: number }[];
  revenueData: Record<string, { date: string; revenue: number; orders: number }[]>;
};

export type InventoryRow = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  size: string;
  color: string;
  schoolName: string;
  category: string;
  stock: number;
  reserved: number;
  status: string;
  lastUpdated: string;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  totalSpent: number;
  lastOrderAt: string;
  status: "active" | "inactive";
};

export type AdminCoupon = {
  id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrder: number;
  usageLimit: number;
  usageCount: number;
  status: "active" | "expired" | "scheduled";
  expiresAt: string;
};

export const adminApi = {
  getDashboard: () => apiGet<AdminDashboardData>("/admin/dashboard"),

  getInventory: () => apiGet<InventoryRow[]>("/admin/inventory"),

  updateStock: (body: { productId: string; sku: string; stock: number }) =>
    apiPatch<{ id: string; stock: number; status: string; lastUpdated: string }>(
      "/admin/inventory",
      body
    ),

  getCustomers: () => apiGet<AdminCustomer[]>("/admin/customers"),

  getCoupons: () => apiGet<AdminCoupon[]>("/admin/coupons"),

  createCoupon: (body: unknown) => apiPost<AdminCoupon>("/admin/coupons", body),

  updateCoupon: (id: string, body: { status?: string }) =>
    apiPatch<AdminCoupon>(`/admin/coupons/${id}`, body),

  deleteCoupon: (id: string) => apiDelete<{ id: string }>(`/admin/coupons/${id}`),

  getReviews: () =>
    apiGet<(import("@/types/review").Review & { status?: string })[]>("/admin/reviews"),

  updateReview: (id: string, body: { status: string }) =>
    apiPatch(`/admin/reviews/${id}`, body),

  deleteReview: (id: string) => apiDelete<{ id: string }>(`/admin/reviews/${id}`),

  getProducts: () => apiGet<PaginatedProducts>("/admin/products"),

  getProduct: (id: string) => apiGet<Product>(`/admin/products/${id}`),

  createProduct: (body: unknown) => apiPost<Product>("/admin/products", body),

  updateProduct: (id: string, body: unknown) =>
    apiPatch<Product>(`/admin/products/${id}`, body),

  deleteProduct: (id: string) => apiDelete<{ id: string }>(`/admin/products/${id}`),

  getSettings: () => apiGet<SiteSettings>("/admin/settings"),

  updateSettings: (body: Partial<SiteSettings>) =>
    apiPatch<SiteSettings>("/admin/settings", body),

  getBanners: () => apiGet<Banner[]>("/admin/banners"),

  createBanner: (body: unknown) => apiPost<Banner>("/admin/banners", body),

  updateBanner: (id: string, body: unknown) =>
    apiPatch<Banner>(`/admin/banners/${id}`, body),

  deleteBanner: (id: string) => apiDelete<{ id: string }>(`/admin/banners/${id}`),

  getCategories: () => apiGet<Category[]>("/admin/categories"),

  createCategory: (body: unknown) => apiPost<Category>("/admin/categories", body),

  updateCategory: (id: string, body: unknown) =>
    apiPatch<Category>(`/admin/categories/${id}`, body),

  deleteCategory: (id: string) => apiDelete<{ id: string }>(`/admin/categories/${id}`),

  bulk: (body: import("@/lib/admin/bulk").BulkRequest) =>
    apiPost<import("@/lib/admin/bulk").BulkResult>("/admin/bulk", body),
};

export const addressesApi = {
  list: () => apiGet<Address[]>("/users/addresses"),

  create: (body: Omit<Address, "id" | "userId">) =>
    apiPost<Address>("/users/addresses", body),

  update: (id: string, body: Partial<Address>) =>
    apiPatch<Address>(`/users/addresses/${id}`, body),

  remove: (id: string) => apiDelete<{ id: string }>(`/users/addresses/${id}`),
};

export const authApi = {
  login: (email: string, password: string) =>
    apiPost<{ user: unknown; token: string }>("/auth/login", { email, password }),

  register: (body: { name: string; email: string; password: string; phone?: string }) =>
    apiPost<{ user: unknown; token: string }>("/auth/register", body),

  getProfile: () => apiGet<{ id: string; name: string; email: string; phone?: string; role: string }>("/users/me"),

  updateProfile: (body: { name?: string; email?: string; phone?: string }) =>
    apiPatch<{ id: string; name: string; email: string; phone?: string }>("/users/me", body),
};
