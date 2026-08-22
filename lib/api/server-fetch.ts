import type { School } from "@/types/school";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import type { Review } from "@/types/review";
import type { Order } from "@/types/order";
import type { Address } from "@/types/address";

export function getServerApiBase(): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000";
  return `${site.replace(/\/$/, "")}/api/v1`;
}

export async function serverFetch<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const res = await fetch(`${getServerApiBase()}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message ?? "API request failed");
  }
  return json.data as T;
}

export type PaginatedProducts = {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type { School, Category, Product, Review, Order, Address };
