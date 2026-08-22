import type { OrderStatus } from "@/types/order";

export type BulkResource =
  | "products"
  | "orders"
  | "categories"
  | "coupons"
  | "banners"
  | "reviews"
  | "inventory";

export type BulkActionId =
  | "delete"
  | "activate"
  | "archive"
  | "approve"
  | "hide"
  | "deactivate"
  | "draft"
  | "zeroStock"
  | "restock"
  | `status:${OrderStatus}`;

export interface BulkActionConfig {
  id: BulkActionId;
  label: string;
  variant?: "danger" | "default";
  confirmTitle: string;
  confirmDescription: (count: number) => string;
}

export interface BulkRequest {
  resource: BulkResource;
  action: BulkActionId;
  ids: string[];
  payload?: {
    status?: OrderStatus;
    items?: { productId: string; sku: string }[];
    restockQuantity?: number;
  };
}

export interface BulkResult {
  processed: number;
  failed: number;
  errors: { id: string; message: string }[];
}

export const PRODUCT_BULK_ACTIONS: BulkActionConfig[] = [
  {
    id: "activate",
    label: "Activate",
    confirmTitle: "Activate products",
    confirmDescription: (n) => `Set ${n} product${n !== 1 ? "s" : ""} to active?`,
  },
  {
    id: "archive",
    label: "Archive",
    confirmTitle: "Archive products",
    confirmDescription: (n) => `Archive ${n} product${n !== 1 ? "s" : ""}? They will be hidden from the storefront.`,
  },
  {
    id: "delete",
    label: "Delete",
    variant: "danger",
    confirmTitle: "Delete products",
    confirmDescription: (n) =>
      `Permanently delete ${n} product${n !== 1 ? "s" : ""}? This cannot be undone.`,
  },
];

export const ORDER_BULK_ACTIONS: BulkActionConfig[] = [
  {
    id: "status:confirmed",
    label: "Mark Confirmed",
    confirmTitle: "Update order status",
    confirmDescription: (n) => `Mark ${n} order${n !== 1 ? "s" : ""} as confirmed?`,
  },
  {
    id: "status:processing",
    label: "Mark Processing",
    confirmTitle: "Update order status",
    confirmDescription: (n) => `Mark ${n} order${n !== 1 ? "s" : ""} as processing?`,
  },
  {
    id: "status:shipped",
    label: "Mark Shipped",
    confirmTitle: "Update order status",
    confirmDescription: (n) => `Mark ${n} order${n !== 1 ? "s" : ""} as shipped?`,
  },
  {
    id: "status:delivered",
    label: "Mark Delivered",
    confirmTitle: "Update order status",
    confirmDescription: (n) => `Mark ${n} order${n !== 1 ? "s" : ""} as delivered?`,
  },
  {
    id: "status:cancelled",
    label: "Mark Cancelled",
    confirmTitle: "Cancel orders",
    confirmDescription: (n) => `Cancel ${n} order${n !== 1 ? "s" : ""}?`,
  },
  {
    id: "delete",
    label: "Delete",
    variant: "danger",
    confirmTitle: "Delete orders",
    confirmDescription: (n) =>
      `Permanently delete ${n} order${n !== 1 ? "s" : ""}? This cannot be undone.`,
  },
];

export const CATEGORY_BULK_ACTIONS: BulkActionConfig[] = [
  {
    id: "delete",
    label: "Delete",
    variant: "danger",
    confirmTitle: "Delete categories",
    confirmDescription: (n) =>
      `Delete ${n} categor${n !== 1 ? "ies" : "y"}? Categories with products will be skipped.`,
  },
];

export const COUPON_BULK_ACTIONS: BulkActionConfig[] = [
  {
    id: "deactivate",
    label: "Deactivate",
    confirmTitle: "Deactivate coupons",
    confirmDescription: (n) => `Deactivate ${n} coupon${n !== 1 ? "s" : ""}?`,
  },
  {
    id: "delete",
    label: "Delete",
    variant: "danger",
    confirmTitle: "Delete coupons",
    confirmDescription: (n) =>
      `Permanently delete ${n} coupon${n !== 1 ? "s" : ""}? This cannot be undone.`,
  },
];

export const BANNER_BULK_ACTIONS: BulkActionConfig[] = [
  {
    id: "activate",
    label: "Activate",
    confirmTitle: "Activate banners",
    confirmDescription: (n) => `Activate ${n} banner${n !== 1 ? "s" : ""} on the storefront?`,
  },
  {
    id: "draft",
    label: "Set Draft",
    confirmTitle: "Draft banners",
    confirmDescription: (n) => `Move ${n} banner${n !== 1 ? "s" : ""} to draft?`,
  },
  {
    id: "delete",
    label: "Delete",
    variant: "danger",
    confirmTitle: "Delete banners",
    confirmDescription: (n) =>
      `Permanently delete ${n} banner${n !== 1 ? "s" : ""}? This cannot be undone.`,
  },
];

export const REVIEW_BULK_ACTIONS: BulkActionConfig[] = [
  {
    id: "approve",
    label: "Approve",
    confirmTitle: "Approve reviews",
    confirmDescription: (n) => `Approve ${n} review${n !== 1 ? "s" : ""}?`,
  },
  {
    id: "hide",
    label: "Hide",
    confirmTitle: "Hide reviews",
    confirmDescription: (n) => `Hide ${n} review${n !== 1 ? "s" : ""} from the storefront?`,
  },
  {
    id: "delete",
    label: "Delete",
    variant: "danger",
    confirmTitle: "Delete reviews",
    confirmDescription: (n) =>
      `Permanently delete ${n} review${n !== 1 ? "s" : ""}? This cannot be undone.`,
  },
];

export const INVENTORY_BULK_ACTIONS: BulkActionConfig[] = [
  {
    id: "zeroStock",
    label: "Mark Out of Stock",
    confirmTitle: "Mark out of stock",
    confirmDescription: (n) => `Set stock to 0 for ${n} variant${n !== 1 ? "s" : ""}?`,
  },
  {
    id: "restock",
    label: "Restock (+10)",
    confirmTitle: "Restock variants",
    confirmDescription: (n) => `Add 10 units to ${n} selected variant${n !== 1 ? "s" : ""}?`,
  },
];
