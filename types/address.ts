export type AddressType = "home" | "work" | "other";

export interface Address {
  id: string;
  userId: string;
  label: AddressType;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}
