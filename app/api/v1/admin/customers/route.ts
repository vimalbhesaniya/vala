import { connectDB } from "@/lib/db/connect";
import { User, Order } from "@/lib/db/models";
import { requireAuth } from "@/lib/api/auth";
import { apiSuccess, handleApiError } from "@/lib/api/response";

export async function GET() {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);

    const customers = await User.find({ role: "CUSTOMER" }).sort({ createdAt: -1 });
    const orders = await Order.find().sort({ createdAt: -1 });

    const orderStats = new Map<
      string,
      { count: number; totalSpent: number; lastOrderAt: string; city: string }
    >();

    for (const order of orders) {
      const key = order.customerEmail.toLowerCase();
      const existing = orderStats.get(key) ?? {
        count: 0,
        totalSpent: 0,
        lastOrderAt: order.createdAt.toISOString(),
        city: order.address.city,
      };
      existing.count += 1;
      existing.totalSpent += order.total;
      if (order.createdAt.toISOString() > existing.lastOrderAt) {
        existing.lastOrderAt = order.createdAt.toISOString();
        existing.city = order.address.city;
      }
      orderStats.set(key, existing);
    }

    const rows = customers.map((user) => {
      const stats = orderStats.get(user.email.toLowerCase());
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone ?? "—",
        city: stats?.city ?? "—",
        orders: stats?.count ?? 0,
        totalSpent: stats?.totalSpent ?? 0,
        lastOrderAt: stats?.lastOrderAt ?? user.createdAt.toISOString(),
        status: (stats?.count ?? 0) > 0 ? ("active" as const) : ("inactive" as const),
      };
    });

    return apiSuccess(rows, "Customers fetched successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
