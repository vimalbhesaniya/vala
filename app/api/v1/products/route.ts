import { connectDB } from "@/lib/db/connect";
import { Product, School, Category } from "@/lib/db/models";
import { serializeProduct } from "@/lib/db/serializers";
import { apiSuccess, handleApiError } from "@/lib/api/response";
import type { FilterQuery } from "mongoose";
import type { IProduct } from "@/lib/db/models/Product";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q");
    const schoolSlug = searchParams.get("school");
    const categorySlug = searchParams.get("category");
    const gender = searchParams.get("gender");
    const size = searchParams.get("size");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") ?? "featured";
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(48, Math.max(1, Number(searchParams.get("limit") ?? 12)));
    const inStock = searchParams.get("inStock") === "true";

    const filter: FilterQuery<IProduct> = { status: "active" };

    if (schoolSlug && schoolSlug !== "all") {
      const school = await School.findOne({ slug: schoolSlug });
      if (school) filter.schoolId = school._id;
    }

    const slugsParam = searchParams.get("slugs");
    if (slugsParam) {
      filter.slug = { $in: slugsParam.split(",").map((s) => s.trim()).filter(Boolean) };
    }

    if (categorySlug && categorySlug !== "all") {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) filter.categoryId = category._id;
    }

    if (gender) filter.gender = { $in: [gender, "unisex"] };
    if (size) filter["variants.size"] = size;
    if (inStock) filter["variants.stock"] = { $gt: 0 };

    if (minPrice || maxPrice) {
      filter["variants.price"] = {};
      if (minPrice) (filter["variants.price"] as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (filter["variants.price"] as Record<string, number>).$lte = Number(maxPrice);
    }

    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      filter.$or = [
        { name: regex },
        { description: regex },
        { tags: regex },
      ];
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    switch (sort) {
      case "price_asc":
        sortOption = { "variants.0.price": 1 };
        break;
      case "price_desc":
        sortOption = { "variants.0.price": -1 };
        break;
      case "rating":
        sortOption = { rating: -1 };
        break;
      case "bestsellers":
        filter.badge = "bestseller";
        sortOption = { rating: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "featured":
      default:
        sortOption = { rating: -1, reviewCount: -1 };
        break;
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("schoolId", "name slug")
        .populate("categoryId", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    return apiSuccess(
      {
        items: products.map(serializeProduct),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      "Products fetched successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
