import { NextResponse } from "next/server";

export function apiSuccess<T>(
  data: T,
  message = "Success",
  status = 200
) {
  return NextResponse.json({ success: true, data, message }, { status });
}

export function apiError(
  message: string,
  status = 400,
  errors?: Record<string, string[]>
) {
  return NextResponse.json(
    { success: false, message, errors },
    { status }
  );
}

export function handleApiError(error: unknown) {
  console.error("[API Error]", error);

  if (error instanceof Error) {
    if (error.message.includes("duplicate key")) {
      return apiError("A record with this value already exists", 409);
    }
    if (error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    if (error.message === "Forbidden") {
      return apiError("Forbidden", 403);
    }
    if (error.message === "Not found") {
      return apiError("Resource not found", 404);
    }
  }

  return apiError("Something went wrong. Please try again.", 500);
}
