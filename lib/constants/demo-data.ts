import type { School } from "@/types/school";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import type { Review } from "@/types/review";

const IMG = {
  hero: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80",
  shirt: "https://images.unsplash.com/photo-1596755094514-f87e34085b68?w=800&q=80",
  shirt2: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&q=80",
  trouser: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
  skirt: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80",
  tie: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80",
  belt: "https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=800&q=80",
  sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba7951?w=800&q=80",
  sports2: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
  shoes: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
  bag: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
  accessories: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
  socks: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80",
  categoryShirts: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
  categoryTrousers: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80",
  categorySkirts: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80",
  categoryTies: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80",
  categoryBelts: "https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=600&q=80",
  categorySports: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
  categoryShoes: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
  categoryBags: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
  categoryAccessories: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80",
};

export const DEMO_SCHOOLS: School[] = [
  {
    id: "sch-1",
    name: "Oakridge International School",
    slug: "oakridge-international",
    logo: "/images/schools/oakridge.svg",
    city: "Hyderabad",
    state: "Telangana",
    description: "Premium international curriculum school uniforms.",
    productCount: 48,
    status: "active",
  },
  {
    id: "sch-2",
    name: "Greenfield Academy",
    slug: "greenfield-academy",
    logo: "/images/schools/greenfield.svg",
    city: "Bangalore",
    state: "Karnataka",
    productCount: 36,
    status: "active",
  },
  {
    id: "sch-3",
    name: "Brightwood Public School",
    slug: "brightwood-public",
    logo: "/images/schools/brightwood.svg",
    city: "Pune",
    state: "Maharashtra",
    productCount: 42,
    status: "active",
  },
  {
    id: "sch-4",
    name: "Riverdale International School",
    slug: "riverdale-international",
    logo: "/images/schools/riverdale.svg",
    city: "Mumbai",
    state: "Maharashtra",
    productCount: 39,
    status: "active",
  },
  {
    id: "sch-5",
    name: "Starlight Academy",
    slug: "starlight-academy",
    logo: "/images/schools/starlight.svg",
    city: "Chennai",
    state: "Tamil Nadu",
    productCount: 33,
    status: "active",
  },
];

export const DEMO_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Shirts", slug: "shirts", image: IMG.categoryShirts, productCount: 12 },
  { id: "cat-2", name: "Trousers", slug: "trousers", image: IMG.categoryTrousers, productCount: 10 },
  { id: "cat-3", name: "Skirts", slug: "skirts", image: IMG.categorySkirts, productCount: 6 },
  { id: "cat-4", name: "Ties", slug: "ties", image: IMG.categoryTies, productCount: 5 },
  { id: "cat-5", name: "Belts", slug: "belts", image: IMG.categoryBelts, productCount: 4 },
  { id: "cat-6", name: "Sports Uniform", slug: "sports", image: IMG.categorySports, productCount: 8 },
  { id: "cat-7", name: "Shoes", slug: "shoes", image: IMG.categoryShoes, productCount: 7 },
  { id: "cat-8", name: "School Bags", slug: "bags", image: IMG.categoryBags, productCount: 5 },
  { id: "cat-9", name: "Accessories", slug: "accessories", image: IMG.categoryAccessories, productCount: 6 },
];

function makeProduct(
  id: string,
  name: string,
  slug: string,
  school: School,
  category: Category,
  images: string[],
  price: number,
  comparePrice: number,
  gender: "boys" | "girls" | "unisex",
  badge?: Product["badge"]
): Product {
  return {
    id,
    name,
    slug,
    description: `Premium ${name.toLowerCase()} designed for ${school.name}. Comfortable fabric, durable stitching, and a perfect fit for everyday school wear.`,
    images,
    schoolId: school.id,
    schoolName: school.name,
    categoryId: category.id,
    categoryName: category.name,
    gender,
    rating: 4.2 + Math.random() * 0.7,
    reviewCount: Math.floor(20 + Math.random() * 180),
    badge,
    variants: [
      { size: "28", color: "Navy", sku: `${id}-28`, price, comparePrice, stock: 24 },
      { size: "30", color: "Navy", sku: `${id}-30`, price, comparePrice, stock: 32 },
      { size: "32", color: "Navy", sku: `${id}-32`, price, comparePrice, stock: 28 },
      { size: "34", color: "Navy", sku: `${id}-34`, price, comparePrice, stock: 18 },
    ],
  };
}

const s = DEMO_SCHOOLS;
const c = DEMO_CATEGORIES;

export const DEMO_PRODUCTS: Product[] = [
  makeProduct("p-1", "Classic White Cotton Shirt", "classic-white-cotton-shirt", s[0], c[0], [IMG.shirt, IMG.shirt2], 699, 899, "boys", "bestseller"),
  makeProduct("p-2", "Navy Blue Formal Trouser", "navy-blue-formal-trouser", s[0], c[1], [IMG.trouser], 899, 1099, "boys", "bestseller"),
  makeProduct("p-3", "School Striped Tie", "school-striped-tie", s[0], c[3], [IMG.tie], 299, 399, "unisex"),
  makeProduct("p-4", "Genuine Leather Belt", "genuine-leather-belt", s[0], c[4], [IMG.belt], 449, 549, "unisex"),
  makeProduct("p-5", "White Ankle Socks (3-Pack)", "white-ankle-socks-3pack", s[0], c[8], [IMG.socks], 249, 299, "unisex"),
  makeProduct("p-6", "Black Formal School Shoes", "black-formal-school-shoes", s[0], c[6], [IMG.shoes], 1299, 1599, "unisex", "bestseller"),
  makeProduct("p-7", "Plaid Pleated Skirt", "plaid-pleated-skirt", s[1], c[2], [IMG.skirt], 799, 999, "girls", "new"),
  makeProduct("p-8", "Half-Sleeve Summer Shirt", "half-sleeve-summer-shirt", s[1], c[0], [IMG.shirt2, IMG.shirt], 649, 799, "boys"),
  makeProduct("p-9", "Grey Melange Trouser", "grey-melange-trouser", s[1], c[1], [IMG.trouser], 849, 999, "boys"),
  makeProduct("p-10", "House Colour Sports Jersey", "house-colour-sports-jersey", s[1], c[5], [IMG.sports2, IMG.sports], 599, 749, "unisex", "sale"),
  makeProduct("p-11", "Canvas School Backpack", "canvas-school-backpack", s[2], c[7], [IMG.bag], 1199, 1499, "unisex", "bestseller"),
  makeProduct("p-12", "Long Sleeve Winter Shirt", "long-sleeve-winter-shirt", s[2], c[0], [IMG.shirt], 749, 899, "girls"),
  makeProduct("p-13", "Elastic Waist Trouser", "elastic-waist-trouser", s[2], c[1], [IMG.trouser], 799, 949, "girls"),
  makeProduct("p-14", "Regulation School Blazer", "regulation-school-blazer", s[2], c[8], [IMG.shirt2], 1899, 2299, "unisex", "new"),
  makeProduct("p-15", "PE Track Pants", "pe-track-pants", s[3], c[5], [IMG.sports], 549, 699, "unisex"),
  makeProduct("p-16", "Crisp White Poplin Shirt", "crisp-white-poplin-shirt", s[3], c[0], [IMG.shirt, IMG.shirt2], 679, 849, "boys", "bestseller"),
  makeProduct("p-17", "Navy Straight Fit Trouser", "navy-straight-fit-trouser", s[3], c[1], [IMG.trouser], 879, 1049, "boys"),
  makeProduct("p-18", "Velcro School Shoes", "velcro-school-shoes", s[3], c[6], [IMG.shoes], 999, 1199, "boys"),
  makeProduct("p-19", "Ribbon Hair Accessory Set", "ribbon-hair-accessory-set", s[4], c[8], [IMG.accessories], 199, 249, "girls"),
  makeProduct("p-20", "Check Pattern Skirt", "check-pattern-skirt", s[4], c[2], [IMG.skirt], 749, 899, "girls"),
  makeProduct("p-21", "Monogrammed School Tie", "monogrammed-school-tie", s[4], c[3], [IMG.tie], 349, 429, "unisex"),
  makeProduct("p-22", "Reversible Sports Jacket", "reversible-sports-jacket", s[4], c[5], [IMG.sports2], 999, 1249, "unisex", "sale"),
  makeProduct("p-23", "Oxford Cotton Shirt", "oxford-cotton-shirt", s[0], c[0], [IMG.shirt2], 729, 899, "girls"),
  makeProduct("p-24", "Adjustable Uniform Belt", "adjustable-uniform-belt", s[1], c[4], [IMG.belt], 399, 499, "unisex"),
  makeProduct("p-25", "Lightweight Running Shoes", "lightweight-running-shoes", s[1], c[6], [IMG.shoes], 1399, 1699, "unisex"),
  makeProduct("p-26", "Waterproof School Bag", "waterproof-school-bag", s[2], c[7], [IMG.bag], 1499, 1799, "unisex"),
  makeProduct("p-27", "Thermal Winter Socks", "thermal-winter-socks", s[3], c[8], [IMG.socks], 299, 349, "unisex"),
  makeProduct("p-28", "Full Zip Sports Hoodie", "full-zip-sports-hoodie", s[3], c[5], [IMG.sports], 849, 1049, "unisex"),
  makeProduct("p-29", "Pleated Navy Skirt", "pleated-navy-skirt", s[0], c[2], [IMG.skirt], 769, 929, "girls", "bestseller"),
  makeProduct("p-30", "Classic Black Leather Shoes", "classic-black-leather-shoes", s[4], c[6], [IMG.shoes], 1499, 1799, "unisex", "bestseller"),
  makeProduct("p-31", "Embroidered Crest Blazer", "embroidered-crest-blazer", s[0], c[8], [IMG.shirt], 2199, 2599, "unisex", "new"),
  makeProduct("p-32", "Cotton Blend PE Shorts", "cotton-blend-pe-shorts", s[1], c[5], [IMG.sports2], 399, 499, "unisex"),
];

export const BESTSELLERS = DEMO_PRODUCTS.filter((p) => p.badge === "bestseller").slice(0, 8);

export const UNIFORM_SET = {
  school: s[0],
  grade: "Grade 6",
  gender: "Boys" as const,
  items: [
    { name: "White Shirt", product: DEMO_PRODUCTS[0], price: 699 },
    { name: "Navy Trouser", product: DEMO_PRODUCTS[1], price: 899 },
    { name: "School Tie", product: DEMO_PRODUCTS[2], price: 299 },
    { name: "Black Belt", product: DEMO_PRODUCTS[3], price: 449 },
  ],
  individualTotal: 2996,
  setPrice: 2699,
  savings: 297,
};

export const DEMO_REVIEWS: Review[] = [
  {
    id: "r-1",
    rating: 5,
    comment: "Very good fabric and perfect sizing. The school collection made shopping extremely easy.",
    customerName: "Priya M.",
    verified: true,
    productName: "Classic White Cotton Shirt",
    schoolName: "Oakridge International School",
    createdAt: "2025-08-10",
  },
  {
    id: "r-2",
    rating: 5,
    comment: "The complete uniform set saved us so much time. Quality exceeded our expectations.",
    customerName: "Rajesh K.",
    verified: true,
    productName: "Navy Blue Formal Trouser",
    schoolName: "Greenfield Academy",
    createdAt: "2025-07-22",
  },
  {
    id: "r-3",
    rating: 4,
    comment: "Shoes are comfortable and durable. My son wears them every day without complaints.",
    customerName: "Ananya S.",
    verified: true,
    productName: "Black Formal School Shoes",
    schoolName: "Brightwood Public School",
    createdAt: "2025-07-15",
  },
  {
    id: "r-4",
    rating: 5,
    comment: "Fast delivery and excellent packaging. The skirt fit perfectly on first try.",
    customerName: "Meera D.",
    verified: true,
    productName: "Plaid Pleated Skirt",
    schoolName: "Starlight Academy",
    createdAt: "2025-06-28",
  },
];

export const HERO_IMAGE = IMG.hero;
