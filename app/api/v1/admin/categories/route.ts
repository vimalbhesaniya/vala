import { connectDB } from "@/lib/db/connect";
import { Category } from "@/lib/db/models";
import { serializeCategory } from "@/lib/db/serializers";
import { requireAuth } from "@/lib/api/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);
    const categories = await Category.find().sort({ sortOrder: 1, name: 1 });
    return apiSuccess(
      categories.map(serializeCategory),
      "Categories fetched successfully"
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
      slug?: string;
      image?: string;
      description?: string;
      sortOrder?: number;
      status?: "active" | "inactive";
    };

    if (!body.name?.trim()) return apiError("name is required");

    const slug = body.slug?.trim() || slugify(body.name);
    const existing = await Category.findOne({ slug });
    if (existing) return apiError("A category with this slug already exists");

    const category = await Category.create({
      name: body.name.trim(),
      slug,
      image:
        body.image ??
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
      description: body.description,
      sortOrder: body.sortOrder ?? 0,
      status: body.status ?? "active",
      productCount: 0,
    });

    return apiSuccess(serializeCategory(category), "Category created successfully", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
