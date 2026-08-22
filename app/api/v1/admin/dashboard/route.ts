import { connectDB } from "@/lib/db/connect";
import { Order, Product, User, School } from "@/lib/db/models";
import { serializeOrder } from "@/lib/db/serializers";
import { requireAuth } from "@/lib/api/auth";
import { apiSuccess, handleApiError } from "@/lib/api/response";
import type { OrderStatus } from "@/types/order";

const STATUS_META: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "#737373" },
  confirmed: { label: "Confirmed", color: "#C89B5A" },
  processing: { label: "Processing", color: "#C89B5A" },
  packed: { label: "Packed", color: "#111111" },
  shipped: { label: "Shipped", color: "#111111" },
  out_for_delivery: { label: "Out for Delivery", color: "#C89B5A" },
  delivered: { label: "Delivered", color: "#2E7D32" },
  cancelled: { label: "Cancelled", color: "#D32F2F" },
  returned: { label: "Returned", color: "#D32F2F" },
};

const PERIOD_DAYS: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "3m": 90,
  "6m": 180,
  "1y": 365,
};

function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export async function GET() {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      allOrdersForStats,
      revenueOrders,
      monthOrders,
      prevMonthOrders,
      productCount,
      customerCount,
      allSchools,
      products,
      recentOrders,
    ] = await Promise.all([
      Order.find(),
      Order.find({ status: { $nin: ["cancelled", "returned"] } }),
      Order.find({
        createdAt: { $gte: monthStart },
        status: { $nin: ["cancelled", "returned"] },
      }),
      Order.find({
        createdAt: { $gte: prevMonthStart, $lt: monthStart },
        status: { $nin: ["cancelled", "returned"] },
      }),
      Product.countDocuments({ status: "active" }),
      User.countDocuments({ role: "CUSTOMER" }),
      School.find(),
      Product.find({ status: "active" })
        .populate("schoolId", "name")
        .sort({ reviewCount: -1 })
        .limit(5),
      Order.find().sort({ createdAt: -1 }).limit(5),
    ]);

    const totalRevenue = revenueOrders.reduce((sum, o) => sum + o.total, 0);
    const monthRevenue = monthOrders.reduce((sum, o) => sum + o.total, 0);
    const prevMonthRevenue = prevMonthOrders.reduce((sum, o) => sum + o.total, 0);
    const revenueChange =
      prevMonthRevenue > 0
        ? Math.round(((monthRevenue - prevMonthRevenue) / prevMonthRevenue) * 1000) / 10
        : 0;
    const orderChange =
      prevMonthOrders.length > 0
        ? Math.round(((monthOrders.length - prevMonthOrders.length) / prevMonthOrders.length) * 1000) / 10
        : 0;

    const statusCounts = (Object.keys(STATUS_META) as OrderStatus[]).map((status) => ({
      status,
      label: STATUS_META[status].label,
      color: STATUS_META[status].color,
      count: allOrdersForStats.filter((o) => o.status === status).length,
    }));

    const productSales = new Map<string, { name: string; schoolName: string; image: string; units: number; revenue: number }>();
    for (const order of revenueOrders) {
      for (const item of order.items) {
        const key = item.productId.toString();
        const existing = productSales.get(key) ?? {
          name: item.name,
          schoolName: item.schoolName,
          image: item.image,
          units: 0,
          revenue: 0,
        };
        existing.units += item.quantity;
        existing.revenue += item.price * item.quantity;
        productSales.set(key, existing);
      }
    }

    const topProducts = [...productSales.entries()]
      .map(([id, data]) => ({ id, ...data, unitsSold: data.units }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const schoolByName = new Map(allSchools.map((s) => [s.name, s]));
    const schoolStats = new Map<string, { id: string; name: string; city: string; logo: string; orders: number; revenue: number }>();

    for (const school of allSchools) {
      schoolStats.set(school.name, {
        id: school._id.toString(),
        name: school.name,
        city: school.city,
        logo: school.logo,
        orders: 0,
        revenue: 0,
      });
    }

    for (const order of revenueOrders) {
      const schoolName = order.items[0]?.schoolName;
      if (!schoolName) continue;
      const stat = schoolStats.get(schoolName);
      if (stat) {
        stat.orders += 1;
        stat.revenue += order.total;
        continue;
      }
      const school = schoolByName.get(schoolName);
      schoolStats.set(schoolName, {
        id: school?._id.toString() ?? schoolName,
        name: schoolName,
        city: school?.city ?? "",
        logo: school?.logo ?? "",
        orders: 1,
        revenue: order.total,
      });
    }
    const topSchools = [...schoolStats.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    const lowStockItems: {
      id: string;
      productName: string;
      sku: string;
      size: string;
      schoolName: string;
      stock: number;
      threshold: number;
    }[] = [];

    const allProducts = await Product.find({ status: "active" })
      .populate("schoolId", "name")
      .limit(100);

    for (const product of allProducts) {
      const school = product.schoolId as unknown as { name?: string } | null;
      for (const variant of product.variants) {
        if (variant.stock <= 10) {
          lowStockItems.push({
            id: `${product._id}-${variant.sku}`,
            productName: product.name,
            sku: variant.sku,
            size: variant.size,
            schoolName: school?.name ?? "",
            stock: variant.stock,
            threshold: 10,
          });
        }
      }
    }
    lowStockItems.sort((a, b) => a.stock - b.stock);

    const revenueData: Record<string, { date: string; revenue: number; orders: number }[]> = {};
    for (const [period, days] of Object.entries(PERIOD_DAYS)) {
      const start = new Date(now);
      start.setDate(start.getDate() - days);
      const periodOrders = revenueOrders.filter((o) => o.createdAt >= start);
      const byDate = new Map<string, { revenue: number; orders: number }>();

      for (const order of periodOrders) {
        const dateKey = order.createdAt.toISOString().split("T")[0];
        const entry = byDate.get(dateKey) ?? { revenue: 0, orders: 0 };
        entry.revenue += order.total;
        entry.orders += 1;
        byDate.set(dateKey, entry);
      }

      const points: { date: string; revenue: number; orders: number }[] = [];
      for (let i = days; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split("T")[0];
        const entry = byDate.get(key) ?? { revenue: 0, orders: 0 };
        points.push({ date: key, ...entry });
      }
      revenueData[period] = points;
    }

    return apiSuccess({
      stats: [
        {
          id: "revenue",
          label: "Total Revenue",
          value: formatInr(totalRevenue),
          change: revenueChange,
          changeLabel: "vs last month",
        },
        {
          id: "orders",
          label: "Total Orders",
          value: allOrdersForStats.length.toLocaleString("en-IN"),
          change: orderChange,
          changeLabel: "vs last month",
        },
        {
          id: "products",
          label: "Active Products",
          value: productCount.toLocaleString("en-IN"),
        },
        {
          id: "customers",
          label: "Customers",
          value: customerCount.toLocaleString("en-IN"),
        },
      ],
      orderStatusCounts: statusCounts,
      topProducts: topProducts.length
        ? topProducts
        : products.map((p) => {
            const school = p.schoolId as unknown as { name?: string } | null;
            return {
              id: p._id.toString(),
              name: p.name,
              schoolName: school?.name ?? "",
              unitsSold: 0,
              revenue: p.variants[0]?.price ?? 0,
              image: p.images[0] ?? "",
            };
          }),
      topSchools,
      lowStockItems: lowStockItems.slice(0, 8),
      recentOrders: recentOrders.map((o) => {
        const serialized = serializeOrder(o);
        return {
          id: serialized.id,
          orderNumber: serialized.orderNumber,
          customerName: serialized.customerName,
          schoolName: serialized.items[0]?.schoolName ?? "—",
          total: serialized.total,
          status: serialized.status,
          createdAt: serialized.createdAt,
          itemCount: serialized.items.reduce((sum, item) => sum + item.quantity, 0),
        };
      }),
      revenueData,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
