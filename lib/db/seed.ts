import { connectDB } from "./connect";
import {
  User,
  School,
  Category,
  Product,
  Review,
  Order,
  UniformSet,
  Coupon,
  Address,
  SiteSettingsModel,
  Banner,
} from "./models";
import { hashPassword } from "@/lib/api/auth";
import {
  DEMO_SCHOOLS,
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  DEMO_REVIEWS,
  UNIFORM_SET,
  HERO_IMAGE,
} from "@/lib/constants/demo-data";
import { DEMO_ORDERS, DEMO_ADDRESSES } from "@/lib/constants/account-data";
import { ADMIN_BANNERS } from "@/lib/constants/admin-data";
import { DEFAULT_SITE_SETTINGS } from "@/lib/constants/default-site-config";

export async function seedDatabase() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    School.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Review.deleteMany({}),
    Order.deleteMany({}),
    UniformSet.deleteMany({}),
    Coupon.deleteMany({}),
    Address.deleteMany({}),
    SiteSettingsModel.deleteMany({}),
    Banner.deleteMany({}),
  ]);

  const schoolMap = new Map<string, string>();
  for (const s of DEMO_SCHOOLS) {
    const doc = await School.create({
      name: s.name,
      slug: s.slug,
      logo: s.logo,
      city: s.city,
      state: s.state,
      description: s.description,
      productCount: s.productCount ?? 0,
      status: s.status,
    });
    schoolMap.set(s.id, doc._id.toString());
  }

  const categoryMap = new Map<string, string>();
  for (const c of DEMO_CATEGORIES) {
    const doc = await Category.create({
      name: c.name,
      slug: c.slug,
      image: c.image,
      productCount: c.productCount,
      sortOrder: 0,
      status: "active",
    });
    categoryMap.set(c.id, doc._id.toString());
  }

  const productMap = new Map<string, string>();
  for (const p of DEMO_PRODUCTS) {
    const doc = await Product.create({
      schoolId: schoolMap.get(p.schoolId),
      categoryId: categoryMap.get(p.categoryId),
      name: p.name,
      slug: p.slug,
      description: p.description,
      images: p.images,
      variants: p.variants,
      gender: p.gender,
      grade: p.grade,
      material: p.material,
      tags: p.tags ?? [],
      badge: p.badge,
      rating: Math.round(p.rating * 10) / 10,
      reviewCount: p.reviewCount,
      status: "active",
    });
    productMap.set(p.id, doc._id.toString());
  }

  for (const r of DEMO_REVIEWS) {
    const product = DEMO_PRODUCTS.find((p) => p.name === r.productName);
    await Review.create({
      productId: product ? productMap.get(product.id) : productMap.values().next().value,
      customerName: r.customerName,
      rating: r.rating,
      comment: r.comment,
      verified: r.verified,
      status: "approved",
    });
  }

  const oakridgeId = schoolMap.get(UNIFORM_SET.school.id)!;
  await UniformSet.create({
    schoolId: oakridgeId,
    name: `${UNIFORM_SET.school.name} ${UNIFORM_SET.grade} ${UNIFORM_SET.gender} Set`,
    slug: "oakridge-grade-6-boys-set",
    grade: UNIFORM_SET.grade,
    gender: UNIFORM_SET.gender,
    items: UNIFORM_SET.items.map((item) => ({
      productId: productMap.get(item.product.id),
      name: item.name,
      price: item.price,
    })),
    individualTotal: UNIFORM_SET.individualTotal,
    setPrice: UNIFORM_SET.setPrice,
    savings: UNIFORM_SET.savings,
    status: "active",
  });

  for (const o of DEMO_ORDERS) {
    await Order.create({
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      customerPhone: o.customerPhone,
      items: o.items.map((item) => ({
        productId: productMap.get(item.productId) ?? productMap.values().next().value,
        productSlug: item.productSlug,
        name: item.name,
        image: item.image,
        schoolName: item.schoolName,
        size: item.size,
        sku: `${item.productId}-${item.size}`,
        quantity: item.quantity,
        price: item.price,
      })),
      status: o.status,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      deliveryMethod: o.deliveryMethod,
      subtotal: o.subtotal,
      discount: o.discount,
      shipping: o.shipping,
      tax: o.tax,
      total: o.total,
      address: o.address,
      estimatedDelivery: o.estimatedDelivery,
    });
  }

  await Coupon.create({
    code: "VALA100",
    description: "₹100 off your order",
    discountType: "fixed",
    discountValue: 100,
    minOrder: 999,
    usageLimit: 500,
    usageCount: 42,
    customerUsageLimit: 1,
    startsAt: new Date("2025-01-01"),
    expiresAt: new Date("2026-12-31"),
    status: "active",
  });

  await User.create({
    name: "VALA Admin",
    email: "admin@vala.com",
    passwordHash: await hashPassword(process.env.SEED_ADMIN_PASSWORD ?? "admin123"),
    phone: "+91 90000 00000",
    role: "ADMIN",
  });

  const priya = await User.create({
    name: "Priya Mehta",
    email: "priya.mehta@email.com",
    passwordHash: await hashPassword("customer123"),
    phone: "+91 98765 43210",
    role: "CUSTOMER",
  });

  for (const addr of DEMO_ADDRESSES) {
    await Address.create({
      userId: priya._id,
      label: addr.label,
      name: addr.name,
      line1: addr.line1,
      line2: addr.line2,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      phone: addr.phone,
      isDefault: addr.isDefault,
    });
  }

  await SiteSettingsModel.create({ key: "default", ...DEFAULT_SITE_SETTINGS });

  for (const banner of ADMIN_BANNERS) {
    await Banner.create({
      title: banner.title,
      subtitle: banner.subtitle,
      cta: banner.cta,
      href: banner.href,
      placement: banner.placement,
      status: banner.status,
      image: banner.placement === "homepage_hero" ? HERO_IMAGE : undefined,
      startsAt: new Date(banner.startsAt),
      endsAt: banner.endsAt ? new Date(banner.endsAt) : undefined,
    });
  }

  return {
    schools: DEMO_SCHOOLS.length,
    categories: DEMO_CATEGORIES.length,
    products: DEMO_PRODUCTS.length,
    reviews: DEMO_REVIEWS.length,
    orders: DEMO_ORDERS.length,
    coupons: 1,
    users: 2,
    addresses: DEMO_ADDRESSES.length,
    settings: 1,
    banners: ADMIN_BANNERS.length,
  };
}
