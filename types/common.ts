export type Gender = "boys" | "girls" | "unisex";

export type ProductStatus = "active" | "draft" | "archived";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
