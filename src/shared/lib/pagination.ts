export type PaginationInput = {
  page?: number;
  pageSize?: number;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

export function normalizePagination(input: PaginationInput): {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
} {
  const page = Math.max(DEFAULT_PAGE, input.page ?? DEFAULT_PAGE);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(DEFAULT_PAGE_SIZE, input.pageSize ?? DEFAULT_PAGE_SIZE),
  );
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return { page, pageSize, skip, take };
}

export function getPaginationMeta(input: {
  total: number;
  page: number;
  pageSize: number;
}): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(input.total / input.pageSize));
  return {
    page: input.page,
    pageSize: input.pageSize,
    total: input.total,
    totalPages,
  };
}
