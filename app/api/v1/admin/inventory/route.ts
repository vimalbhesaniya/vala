import { connectDB } from "@/lib/db/connect";
import { Product } from "@/lib/db/models";
import { requireAuth } from "@/lib/api/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";

function stockStatus(stock: number) {
  if (stock === 0) return "out_of_stock";
  if (stock <= 10) return "low_stock";
  return "in_stock";
}

export async function GET() {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);

    const products = await Product.find()
      .populate("schoolId", "name")
      .populate("categoryId", "name")
      .sort({ name: 1 });

    const rows: {
      id: string;
      productId: string;
      productName: string;
      sku: string;
      size: string;
      color: string;
      schoolName: string;
      category: string;
      stock: number;
      reserved: number;
      status: string;
      lastUpdated: string;
    }[] = [];

    for (const product of products) {
      const school = product.schoolId as unknown as { name?: string } | null;
      const category = product.categoryId as unknown as { name?: string } | null;
      for (const variant of product.variants) {
        rows.push({
          id: `${product._id}-${variant.sku}`,
          productId: product._id.toString(),
          productName: product.name,
          sku: variant.sku,
          size: variant.size,
          color: variant.color,
          schoolName: school?.name ?? "",
          category: category?.name ?? "",
          stock: variant.stock,
          reserved: 0,
          status: stockStatus(variant.stock),
          lastUpdated: product.updatedAt.toISOString(),
        });
      }
    }

    return apiSuccess(rows, "Inventory fetched successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);

    const body = (await request.json()) as {
      productId: string;
      sku: string;
      stock: number;
    };

    if (!body.productId || !body.sku || body.stock < 0) {
      return apiError("productId, sku, and stock (>= 0) are required");
    }

    const product = await Product.findById(body.productId);
    if (!product) return apiError("Product not found", 404);

    const variant = product.variants.find((v) => v.sku === body.sku);
    if (!variant) return apiError("Variant not found", 404);

    variant.stock = body.stock;
    await product.save();

    return apiSuccess(
      {
        id: `${product._id}-${variant.sku}`,
        stock: variant.stock,
        status: stockStatus(variant.stock),
        lastUpdated: product.updatedAt.toISOString(),
      },
      "Stock updated successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
