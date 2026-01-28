import { Prisma } from "@prisma/client";
import { prisma } from "@/db/client";
import { requireAdmin } from "@/features/auth/permissions";
import { userQuerySchema, type UserQueryInput } from "@/features/users/schemas";
import { type UsersResponse } from "@/features/users/types";
import { getPaginationMeta, normalizePagination } from "@/shared/lib/pagination";
import { providerSupportsCaseInsensitiveFiltering } from "@/db/provider";

const SORTABLE_FIELDS: Record<string, Prisma.UserOrderByWithRelationInput> = {
  createdAt: { createdAt: "desc" },
  name: { name: "asc" },
};

export function buildUserSearchFilter(query?: string): Prisma.UserWhereInput {
  const trimmed = query?.trim();
  if (!trimmed) {
    return {};
  }

  const stringFilter: Prisma.StringFilter = providerSupportsCaseInsensitiveFiltering()
    ? { contains: trimmed, mode: "insensitive" }
    : { contains: trimmed };

  return {
    OR: [
      { name: stringFilter },
      { email: stringFilter },
    ],
  };
}

export async function getUsers(input: UserQueryInput): Promise<UsersResponse> {
  await requireAdmin();

  const parsed = userQuerySchema.parse(input);
  const { page, pageSize, skip, take } = normalizePagination(parsed);

  const where = buildUserSearchFilter(parsed.q);

  const orderBy =
    parsed.sort && parsed.order
      ? {
          [parsed.sort]: parsed.order,
        }
      : SORTABLE_FIELDS.createdAt;

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      skip,
      take,
    }),
    prisma.user.count({ where }),
  ]);

  const meta = getPaginationMeta({ total, page, pageSize });

  return {
    items: items.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    })),
    total,
    ...meta,
  };
}
