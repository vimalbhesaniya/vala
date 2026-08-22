export interface SiteSettings {
  store: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  shipping: {
    freeThreshold: number;
    standardRate: number;
    expressRate: number;
    processingDays: number;
  };
  payments: {
    codEnabled: boolean;
    onlineEnabled: boolean;
    razorpayKey: string;
  };
  tax: {
    gstEnabled: boolean;
    gstRate: number;
    gstNumber: string;
  };
}
