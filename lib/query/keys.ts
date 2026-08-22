export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...productKeys.lists(), filters] as const,
  detail: (slug: string) => [...productKeys.all, "detail", slug] as const,
};

export const schoolKeys = {
  all: ["schools"] as const,
  lists: () => [...schoolKeys.all, "list"] as const,
  detail: (slug: string) => [...schoolKeys.all, "detail", slug] as const,
};

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  detail: (slug: string) => [...categoryKeys.all, "detail", slug] as const,
};

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};
