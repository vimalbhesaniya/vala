import { connectDB } from "@/lib/db/connect";
import { Review, Product } from "@/lib/db/models";
import { serializeReview } from "@/lib/db/serializers";
import { apiSuccess, handleApiError } from "@/lib/api/response";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const productSlug = searchParams.get("product");

    const filter: Record<string, unknown> = { status: "approved" };

    if (productSlug) {
      const product = await Product.findOne({ slug: productSlug });
      if (product) filter.productId = product._id;
    }

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate({ path: "productId", select: "name", populate: { path: "schoolId", select: "name" } });

    return apiSuccess(
      reviews.map((r) => {
        const product = r.productId as unknown as {
          name?: string;
          schoolId?: { name?: string };
        } | null;
        return serializeReview(r, {
          name: product?.name ?? "",
          schoolName: product?.schoolId?.name ?? "",
        });
      }),
      "Reviews fetched successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
