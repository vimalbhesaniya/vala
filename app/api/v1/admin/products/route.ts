import { connectDB } from "@/lib/db/connect";
import { Product } from "@/lib/db/models";
import { serializeProduct } from "@/lib/db/serializers";
import { requireAuth } from "@/lib/api/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";

export async function GET() {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);

    const products = await Product.find()
      .populate("schoolId", "name slug")
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 });

    return apiSuccess(
      {
        items: products.map(serializeProduct),
        total: products.length,
        page: 1,
        limit: products.length,
        totalPages: 1,
      },
      "Admin products fetched successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);

    const body = (await request.json()) as {
      name: string;
      slug: string;
      description: string;
      schoolId: string;
      categoryId: string;
      gender: "boys" | "girls" | "unisex";
      price: number;
      comparePrice?: number;
      images?: string[];
    };

    if (!body.name || !body.slug || !body.schoolId || !body.categoryId || !body.price) {
      return apiError("name, slug, schoolId, categoryId, and price are required");
    }

    const sku = `${body.slug}-default`.toUpperCase().replace(/-/g, "");
    const product = await Product.create({
      name: body.name,
      slug: body.slug.toLowerCase(),
      description: body.description ?? "",
      schoolId: body.schoolId,
      categoryId: body.categoryId,
      gender: body.gender ?? "unisex",
      images: body.images ?? [
        "https://images.unsplash.com/photo-1596755094514-f87e34085b68?w=800&q=80",
      ],
      variants: [
        {
          size: "M",
          color: "Default",
          sku,
          price: body.price,
          comparePrice: body.comparePrice ?? body.price,
          stock: 50,
        },
      ],
      tags: [],
      status: "active",
    });

    const populated = await Product.findById(product._id)
      .populate("schoolId", "name slug")
      .populate("categoryId", "name slug");

    return apiSuccess(serializeProduct(populated!), "Product created successfully", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
