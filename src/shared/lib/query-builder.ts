type QueryValue = string | number | undefined | null | boolean;

export type QueryParams = Record<string, QueryValue>;

export function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function mergeQueryParams(current: URLSearchParams, updates: QueryParams) {
  const merged = new URLSearchParams(current.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      merged.delete(key);
    } else {
      merged.set(key, String(value));
    }
  });

  return merged;
}
