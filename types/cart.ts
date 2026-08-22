export interface CartItem {
  id: string;
  productId: string;
  productSlug: string;
  name: string;
  image: string;
  schoolName: string;
  size: string;
  color: string;
  sku: string;
  price: number;
  comparePrice: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  lastAddedItem: CartItem | null;
}
