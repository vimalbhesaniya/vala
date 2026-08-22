import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api/v1",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("vala-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ?? "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export async function apiGet<T>(
  url: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  const cleaned = params
    ? (Object.fromEntries(
        Object.entries(params).filter((entry): entry is [string, string | number | boolean] => entry[1] !== undefined)
      ) as Record<string, string | number | boolean>)
    : undefined;
  const { data } = await apiClient.get<ApiResponse<T>>(url, { params: cleaned });
  return data;
}

export async function apiPost<T>(url: string, body?: unknown) {
  const { data } = await apiClient.post<ApiResponse<T>>(url, body);
  return data;
}

export async function apiPatch<T>(url: string, body?: unknown) {
  const { data } = await apiClient.patch<ApiResponse<T>>(url, body);
  return data;
}

export async function apiDelete<T>(url: string) {
  const { data } = await apiClient.delete<ApiResponse<T>>(url);
  return data;
}

export default apiClient;
