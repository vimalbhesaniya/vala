export interface UniformSetItem {
  productId: string;
  name: string;
  price: number;
}

export interface UniformSet {
  id: string;
  schoolId: string;
  schoolName?: string;
  name: string;
  slug: string;
  grade: string;
  gender: string;
  items: UniformSetItem[];
  individualTotal: number;
  setPrice: number;
  savings: number;
  status: "active" | "archived";
}
