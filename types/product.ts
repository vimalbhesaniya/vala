import type { Gender } from "./common";

export interface ProductVariant {
  size: string;
  color: string;
  sku: string;
  price: number;
  comparePrice: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  schoolId: string;
  schoolName: string;
  schoolSlug?: string;
  categoryId: string;
  categoryName: string;
  categorySlug?: string;
  gender: Gender;
  grade?: string;
  material?: string;
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  badge?: "bestseller" | "new" | "sale";
  tags?: string[];
  status?: "active" | "draft" | "archived";
}

export function getProductPrice(product: Product): {
  price: number;
  comparePrice: number;
} {
  const variant = product.variants[0];
  return {
    price: variant?.price ?? 0,
    comparePrice: variant?.comparePrice ?? 0,
  };
}
