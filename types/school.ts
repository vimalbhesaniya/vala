export interface School {
  id: string;
  name: string;
  slug: string;
  logo: string;
  city: string;
  state: string;
  description?: string;
  productCount?: number;
  status: "active" | "inactive";
}
