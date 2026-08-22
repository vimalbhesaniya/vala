export interface Review {
  id: string;
  rating: number;
  comment: string;
  customerName: string;
  verified: boolean;
  productName: string;
  schoolName: string;
  status?: "approved" | "pending" | "hidden";
  createdAt: string;
}
