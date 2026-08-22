import type { ISchool } from "./models/School";
import type { ICategory } from "./models/Category";
import type { IProduct } from "./models/Product";
import type { IReview } from "./models/Review";
import type { IOrder } from "./models/Order";
import type { IUniformSet } from "./models/UniformSet";
import type { ICoupon } from "./models/Coupon";
import type { ISiteSettings } from "./models/SiteSettings";
import type { IBanner } from "./models/Banner";

/** Mongoose subdocuments don't spread like plain objects — use toObject() first. */
function plainSubdoc<T>(doc: T & { toObject?: () => T }): T {
  return typeof doc.toObject === "function" ? doc.toObject() : doc;
}

type PopulatedProduct = IProduct & {
  schoolId?: ISchool | IProduct["schoolId"];
  categoryId?: ICategory | IProduct["categoryId"];
};

export function serializeSchool(school: ISchool) {
  return {
    id: school._id.toString(),
    name: school.name,
    slug: school.slug,
    logo: school.logo,
    city: school.city,
    state: school.state,
    description: school.description,
    contact: school.contact,
    productCount: school.productCount,
    status: school.status,
  };
}

export function serializeCategory(category: ICategory) {
  return {
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    image: category.image,
    description: category.description,
    productCount: category.productCount,
    sortOrder: category.sortOrder,
    status: category.status,
  };
}

export function serializeProduct(product: PopulatedProduct) {
  const school =
    product.schoolId && typeof product.schoolId === "object" && "name" in product.schoolId
      ? product.schoolId
      : null;
  const category =
    product.categoryId && typeof product.categoryId === "object" && "name" in product.categoryId
      ? product.categoryId
      : null;

  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    images: product.images,
    schoolId: school ? school._id.toString() : String(product.schoolId),
    schoolName: school?.name ?? "",
    schoolSlug: school && "slug" in school ? school.slug : undefined,
    categoryId: category ? category._id.toString() : String(product.categoryId),
    categoryName: category?.name ?? "",
    categorySlug: category && "slug" in category ? category.slug : undefined,
    gender: product.gender,
    grade: product.grade,
    material: product.material,
    season: product.season,
    tags: product.tags,
    badge: product.badge,
    rating: product.rating,
    reviewCount: product.reviewCount,
    status: product.status,
    variants: product.variants,
  };
}

export function serializeReview(
  review: IReview,
  product?: { name: string; schoolName?: string }
) {
  return {
    id: review._id.toString(),
    rating: review.rating,
    comment: review.comment,
    customerName: review.customerName,
    verified: review.verified,
    productName: product?.name ?? "",
    schoolName: product?.schoolName ?? "",
    status: review.status,
    createdAt: review.createdAt.toISOString().split("T")[0],
  };
}

export function serializeOrder(order: IOrder) {
  return {
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    userId: order.userId?.toString(),
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    items: order.items.map((item) => {
      const plain = plainSubdoc(item);
      return {
        productId: String(plain.productId),
        productSlug: plain.productSlug,
        name: plain.name,
        image: plain.image,
        schoolName: plain.schoolName,
        size: plain.size,
        sku: plain.sku,
        quantity: plain.quantity,
        price: plain.price,
      };
    }),
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    deliveryMethod: order.deliveryMethod,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    tax: order.tax,
    total: order.total,
    address: order.address,
    estimatedDelivery: order.estimatedDelivery,
    createdAt: order.createdAt.toISOString().split("T")[0],
  };
}

export function serializeUniformSet(
  set: IUniformSet,
  school?: ISchool
) {
  return {
    id: set._id.toString(),
    schoolId: set.schoolId.toString(),
    schoolName: school?.name,
    name: set.name,
    slug: set.slug,
    grade: set.grade,
    gender: set.gender,
    items: set.items.map((item) => {
      const plain = plainSubdoc(item);
      return {
        productId: String(plain.productId),
        name: plain.name,
        price: plain.price,
      };
    }),
    individualTotal: set.individualTotal,
    setPrice: set.setPrice,
    savings: set.savings,
    status: set.status,
  };
}

export function serializeCoupon(coupon: ICoupon) {
  return {
    id: coupon._id.toString(),
    code: coupon.code,
    description: coupon.description,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    minOrder: coupon.minOrder,
    maxDiscount: coupon.maxDiscount,
    usageLimit: coupon.usageLimit,
    usageCount: coupon.usageCount,
    status: coupon.status,
    expiresAt: coupon.expiresAt.toISOString(),
  };
}

export function serializeSiteSettings(doc: ISiteSettings) {
  return {
    store: doc.store,
    shipping: doc.shipping,
    payments: doc.payments,
    tax: doc.tax,
  };
}

export function serializeBanner(banner: IBanner) {
  return {
    id: banner._id.toString(),
    title: banner.title,
    subtitle: banner.subtitle,
    cta: banner.cta,
    href: banner.href,
    placement: banner.placement,
    status: banner.status,
    image: banner.image,
    startsAt: banner.startsAt.toISOString(),
    endsAt: banner.endsAt?.toISOString(),
  };
}
