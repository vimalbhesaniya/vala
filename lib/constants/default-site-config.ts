import type { SiteSettings } from "@/types/site-settings";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  store: {
    name: "VALA",
    email: "hello@valauniforms.com",
    phone: "+91 40 1234 5678",
    address: "Hyderabad, Telangana, India",
  },
  shipping: {
    freeThreshold: 999,
    standardRate: 99,
    expressRate: 149,
    processingDays: 2,
  },
  payments: {
    codEnabled: true,
    onlineEnabled: true,
    razorpayKey: "",
  },
  tax: {
    gstEnabled: true,
    gstRate: 5,
    gstNumber: "",
  },
};
