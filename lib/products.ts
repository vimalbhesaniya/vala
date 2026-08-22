import type { Product } from "@/types/product";
import { DEMO_PRODUCTS, DEMO_SCHOOLS, DEMO_CATEGORIES } from "@/lib/constants/demo-data";

export type SortOption =
  | "featured"
  | "newest"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "bestsellers";

export interface ProductFilters {
  query?: string;
  schoolSlug?: string;
  categoryId?: string;
  categorySlug?: string;
  gender?: string;
  grade?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

/** URL query param names used by ProductListing ↔ /api/v1/products */
export const PRODUCT_FILTER_PARAMS = {
  query: "q",
  schoolSlug: "school",
  categorySlug: "category",
  gender: "gender",
  size: "size",
  sort: "sort",
  inStock: "inStock",
  minPrice: "minPrice",
  maxPrice: "maxPrice",
  page: "page",
} as const;

/** Sentinel values written to URL when user clears school/category filters */
export const ALL_SCHOOLS_FILTER = "all";
export const ALL_CATEGORIES_FILTER = "all";

export function parseProductFiltersFromSearchParams(
  searchParams: URLSearchParams,
  defaults: Partial<ProductFilters> = {},
  selectedSchoolSlug?: string
): ProductFilters {
  const schoolParam = searchParams.get(PRODUCT_FILTER_PARAMS.schoolSlug);
  const categoryParam = searchParams.get(PRODUCT_FILTER_PARAMS.categorySlug);

  let schoolSlug: string | undefined;
  if (schoolParam === ALL_SCHOOLS_FILTER) schoolSlug = undefined;
  else if (schoolParam) schoolSlug = schoolParam;
  else schoolSlug = defaults.schoolSlug ?? selectedSchoolSlug;

  let categorySlug: string | undefined;
  if (categoryParam === ALL_CATEGORIES_FILTER) categorySlug = undefined;
  else if (categoryParam) categorySlug = categoryParam;
  else categorySlug = defaults.categorySlug;

  const minPriceRaw = searchParams.get(PRODUCT_FILTER_PARAMS.minPrice);
  const maxPriceRaw = searchParams.get(PRODUCT_FILTER_PARAMS.maxPrice);
  const pageRaw = searchParams.get(PRODUCT_FILTER_PARAMS.page);

  return {
    query: searchParams.get(PRODUCT_FILTER_PARAMS.query) || defaults.query,
    schoolSlug,
    categorySlug,
    gender: searchParams.get(PRODUCT_FILTER_PARAMS.gender) || defaults.gender,
    size: searchParams.get(PRODUCT_FILTER_PARAMS.size) || defaults.size,
    sort: (searchParams.get(PRODUCT_FILTER_PARAMS.sort) as SortOption) || defaults.sort || "featured",
    inStock:
      searchParams.get(PRODUCT_FILTER_PARAMS.inStock) === "true" || defaults.inStock,
    minPrice: minPriceRaw ? Number(minPriceRaw) : defaults.minPrice,
    maxPrice: maxPriceRaw ? Number(maxPriceRaw) : defaults.maxPrice,
    page: pageRaw ? Math.max(1, Number(pageRaw)) : 1,
    limit: defaults.limit ?? 12,
  };
}

export function productFiltersToApiParams(filters: ProductFilters) {
  return {
    q: filters.query,
    school: filters.schoolSlug,
    category: filters.categorySlug,
    gender: filters.gender,
    size: filters.size,
    sort: filters.sort,
    page: filters.page,
    limit: filters.limit,
    inStock: filters.inStock ? "true" : undefined,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  };
}

export function getProductBySlug(slug: string): Product | undefined {
  return DEMO_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return DEMO_PRODUCTS.find((p) => p.id === id);
}

export function getSchoolBySlug(slug: string) {
  return DEMO_SCHOOLS.find((s) => s.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return DEMO_CATEGORIES.find((c) => c.slug === slug);
}

export function filterProducts(filters: ProductFilters): {
  products: Product[];
  total: number;
} {
  let results = [...DEMO_PRODUCTS];
  const {
    query,
    schoolSlug,
    categoryId,
    categorySlug,
    gender,
    size,
    minPrice,
    maxPrice,
    inStock,
    sort = "featured",
    page = 1,
    limit = 12,
  } = filters;

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.schoolName.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q)) ||
        p.variants.some((v) => v.sku.toLowerCase().includes(q))
    );
  }

  if (schoolSlug) {
    const school = DEMO_SCHOOLS.find((s) => s.slug === schoolSlug);
    if (school) results = results.filter((p) => p.schoolId === school.id);
  }
  if (categoryId) results = results.filter((p) => p.categoryId === categoryId);
  if (categorySlug) {
    const cat = getCategoryBySlug(categorySlug);
    if (cat) results = results.filter((p) => p.categoryId === cat.id);
  }
  if (gender) results = results.filter((p) => p.gender === gender || p.gender === "unisex");
  if (size) results = results.filter((p) => p.variants.some((v) => v.size === size));
  if (minPrice !== undefined)
    results = results.filter((p) => p.variants[0].price >= minPrice);
  if (maxPrice !== undefined)
    results = results.filter((p) => p.variants[0].price <= maxPrice);
  if (inStock)
    results = results.filter((p) => p.variants.some((v) => v.stock > 0));

  switch (sort) {
    case "price_asc":
      results.sort((a, b) => a.variants[0].price - b.variants[0].price);
      break;
    case "price_desc":
      results.sort((a, b) => b.variants[0].price - a.variants[0].price);
      break;
    case "rating":
      results.sort((a, b) => b.rating - a.rating);
      break;
    case "bestsellers":
      results = results.filter((p) => p.badge === "bestseller").concat(
        results.filter((p) => p.badge !== "bestseller")
      );
      break;
    case "newest":
      results.sort((a, b) => (b.badge === "new" ? 1 : 0) - (a.badge === "new" ? 1 : 0));
      break;
    default:
      break;
  }

  const total = results.length;
  const start = (page - 1) * limit;
  return { products: results.slice(start, start + limit), total };
}

export function getSearchSuggestions(query: string): string[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const suggestions = new Set<string>();

  DEMO_PRODUCTS.forEach((p) => {
    if (p.name.toLowerCase().includes(q)) suggestions.add(p.name);
    if (p.schoolName.toLowerCase().includes(q))
      suggestions.add(`${p.schoolName.split(" ")[0]} ${p.categoryName}`);
  });

  if (q.includes("shirt")) suggestions.add("White School Shirt");
  if (q.includes("white")) suggestions.add("Boys White Shirt");
  if (q.includes("oak")) suggestions.add("Oakridge White Shirt");

  return Array.from(suggestions).slice(0, 5);
}

export const POPULAR_SEARCHES = [
  "White shirt",
  "Navy trouser",
  "School shoes",
  "Sports uniform",
  "Oakridge",
  "Grade 6 boys",
];

export const ALL_SIZES = ["28", "30", "32", "34", "36"];
export const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹1000", min: 500, max: 1000 },
  { label: "₹1000 – ₹2000", min: 1000, max: 2000 },
  { label: "Over ₹2000", min: 2000, max: 99999 },
];
