import type { SearchProductsRequest } from "@repo/types/contracts";

export function normalizeParam(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export function copyParams(
  sp: URLSearchParams,
  params: Record<string, string | string[] | undefined>
): void {
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    const v = Array.isArray(value) ? value[0] : value;
    if (v !== undefined) sp.set(key, v);
  }
}

export function buildRemoveUrl(
  pathname: string,
  params: Record<string, string | string[] | undefined>,
  ...removeKeys: string[]
): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && !removeKeys.includes(key)) {
      const v = Array.isArray(value) ? value[0] : value;
      if (v !== undefined) sp.set(key, v);
    }
  }
  const qs = sp.toString();
  return `${pathname}${qs ? `?${qs}` : ""}`;
}

export function buildKeepUrl(
  pathname: string,
  params: Record<string, string | string[] | undefined>,
  ...keepKeys: string[]
): string {
  const sp = new URLSearchParams();
  for (const key of keepKeys) {
    const value = params[key];
    if (value === undefined) continue;
    const v = Array.isArray(value) ? value[0] : value;
    if (v !== undefined) sp.set(key, v);
  }
  const qs = sp.toString();
  return `${pathname}${qs ? `?${qs}` : ""}`;
}

export function toSearchRequest(
  sp: URLSearchParams | Record<string, string | string[] | undefined>
): SearchProductsRequest {
  const get = (key: string) => {
    if (sp instanceof URLSearchParams) return sp.get(key) ?? undefined;
    return normalizeParam(sp[key]);
  };
  const has = (key: string) => {
    if (sp instanceof URLSearchParams) return sp.has(key);
    return sp[key] !== undefined;
  };

  const sortBy = get("sortBy");
  return {
    q: get("q"),
    categoryId: get("categoryId"),
    onSale: get("onSale") === "true" ? true : undefined,
    minRating: has("minRating") ? Number(get("minRating")) : undefined,
    optionValues: get("optionValues"),
    sortBy:
      sortBy && ["price_asc", "price_desc", "rating_desc", "newest"].includes(sortBy)
        ? (sortBy as SearchProductsRequest["sortBy"])
        : "rating_desc",
    limit: 12,
  };
}

export function parseOptionValues(v: string | string[] | undefined): Set<string> {
  const value = Array.isArray(v) ? v[0] : v;
  if (!value) return new Set();
  return new Set(value.split(","));
}

export function toQueryString(params: Partial<Record<string, string | undefined>>): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) sp.set(key, value);
  }
  return sp.toString() ? `?${sp.toString()}` : "";
}
