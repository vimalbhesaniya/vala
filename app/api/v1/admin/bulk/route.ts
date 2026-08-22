import { connectDB } from "@/lib/db/connect";
import {
  Banner,
  Category,
  Coupon,
  Order,
  Product,
  Review,
} from "@/lib/db/models";
import { requireAuth } from "@/lib/api/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";
import type { BulkActionId, BulkRequest, BulkResource, BulkResult } from "@/lib/admin/bulk";
import type { OrderStatus } from "@/types/order";

function stockStatus(stock: number) {
  if (stock === 0) return "out_of_stock";
  if (stock <= 10) return "low_stock";
  return "in_stock";
}

async function processOne(
  resource: BulkResource,
  action: BulkActionId,
  id: string,
  payload?: BulkRequest["payload"]
): Promise<void> {
  switch (resource) {
    case "products": {
      if (action === "delete") {
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) throw new Error("Product not found");
        return;
      }
      const product = await Product.findById(id);
      if (!product) throw new Error("Product not found");
      if (action === "activate") product.status = "active";
      else if (action === "archive") product.status = "archived";
      else throw new Error("Unsupported action");
      await product.save();
      return;
    }
    case "orders": {
      if (action === "delete") {
        const deleted = await Order.findByIdAndDelete(id);
        if (!deleted) throw new Error("Order not found");
        return;
      }
      if (action.startsWith("status:")) {
        const status = action.replace("status:", "") as OrderStatus;
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) throw new Error("Order not found");
        return;
      }
      throw new Error("Unsupported action");
    }
    case "categories": {
      if (action !== "delete") throw new Error("Unsupported action");
      const productCount = await Product.countDocuments({ categoryId: id });
      if (productCount > 0) throw new Error("Category has assigned products");
      const deleted = await Category.findByIdAndDelete(id);
      if (!deleted) throw new Error("Category not found");
      return;
    }
    case "coupons": {
      const coupon = await Coupon.findById(id);
      if (!coupon) throw new Error("Coupon not found");
      if (action === "delete") {
        await Coupon.findByIdAndDelete(id);
        return;
      }
      if (action === "deactivate") {
        coupon.status = "expired";
        await coupon.save();
        return;
      }
      throw new Error("Unsupported action");
    }
    case "banners": {
      const banner = await Banner.findById(id);
      if (!banner) throw new Error("Banner not found");
      if (action === "delete") {
        await Banner.findByIdAndDelete(id);
        return;
      }
      if (action === "activate") banner.status = "active";
      else if (action === "draft") banner.status = "draft";
      else throw new Error("Unsupported action");
      await banner.save();
      return;
    }
    case "reviews": {
      if (action === "delete") {
        const deleted = await Review.findByIdAndDelete(id);
        if (!deleted) throw new Error("Review not found");
        return;
      }
      const review = await Review.findById(id);
      if (!review) throw new Error("Review not found");
      if (action === "approve") review.status = "approved";
      else if (action === "hide") review.status = "hidden";
      else throw new Error("Unsupported action");
      await review.save();
      return;
    }
    case "inventory": {
      const item = payload?.items?.find((entry) => `${entry.productId}-${entry.sku}` === id);
      if (!item) throw new Error("Inventory item not found in payload");
      const product = await Product.findById(item.productId);
      if (!product) throw new Error("Product not found");
      const variant = product.variants.find((v) => v.sku === item.sku);
      if (!variant) throw new Error("Variant not found");
      if (action === "zeroStock") variant.stock = 0;
      else if (action === "restock") variant.stock += payload?.restockQuantity ?? 10;
      else throw new Error("Unsupported action");
      await product.save();
      return;
    }
    default:
      throw new Error("Unsupported resource");
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);

    const body = (await request.json()) as BulkRequest;
    const { resource, action, ids, payload } = body;

    if (!resource || !action || !Array.isArray(ids) || ids.length === 0) {
      return apiError("resource, action, and ids are required");
    }

    if (ids.length > 200) {
      return apiError("Maximum 200 items per bulk operation");
    }

    const result: BulkResult = { processed: 0, failed: 0, errors: [] };

    for (const id of ids) {
      try {
        await processOne(resource, action, id, payload);
        result.processed += 1;
      } catch (error) {
        result.failed += 1;
        result.errors.push({
          id,
          message: error instanceof Error ? error.message : "Operation failed",
        });
      }
    }

    if (result.processed === 0) {
      return apiError(result.errors[0]?.message ?? "Bulk operation failed", 400);
    }

    return apiSuccess(
      result,
      result.failed > 0
        ? `${result.processed} updated, ${result.failed} failed`
        : `${result.processed} item${result.processed !== 1 ? "s" : ""} updated successfully`
    );
  } catch (error) {
    return handleApiError(error);
  }
}
