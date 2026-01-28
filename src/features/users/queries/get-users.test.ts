import { describe, expect, it, vi, beforeEach } from "vitest";

const mockUsers = [
  {
    id: "1",
    name: "Jane Doe",
    email: "jane@example.com",
    role: "ADMIN",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    passwordHash: "hash",
  },
];

vi.mock("@/features/auth/permissions", () => ({
  requireAdmin: vi.fn(),
}));

const mockedPrisma = vi.hoisted(() => ({
  findMany: vi.fn(),
  count: vi.fn(),
}));

vi.mock("@/db/client", () => ({
  prisma: {
    user: {
      findMany: mockedPrisma.findMany,
      count: mockedPrisma.count,
    },
  },
}));

const mockSupportsInsensitive = vi.hoisted(() => vi.fn(() => true));

vi.mock("@/db/provider", () => ({
  providerSupportsCaseInsensitiveFiltering: () => mockSupportsInsensitive() as boolean,
}));

import { getUsers, buildUserSearchFilter } from "@/features/users/queries/get-users";

describe("getUsers query", () => {
  beforeEach(() => {
    mockedPrisma.findMany.mockResolvedValue(mockUsers);
    mockedPrisma.count.mockResolvedValue(mockUsers.length);
    mockSupportsInsensitive.mockReturnValue(true);
  });

  it("applies search filters and returns normalized data", async () => {
    const result = await getUsers({
      page: 1,
      pageSize: 10,
      q: "Jane",
      sort: "createdAt",
      order: "desc",
    });

    expect(mockedPrisma.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.any(Array),
        }),
      }),
    );

    expect(mockedPrisma.count).toHaveBeenCalled();
    expect(result.items[0].name).toBe("Jane Doe");
    expect(result.total).toBe(1);
  });
});

describe("buildUserSearchFilter", () => {
  it("includes case-insensitive mode when provider supports it", () => {
    mockSupportsInsensitive.mockReturnValue(true);
    const filter = buildUserSearchFilter("Admin");
    expect(filter).toEqual({
      OR: [
        { name: { contains: "Admin", mode: "insensitive" } },
        { email: { contains: "Admin", mode: "insensitive" } },
      ],
    });
  });

  it("omits mode when provider does not support case-insensitive filters", () => {
    mockSupportsInsensitive.mockReturnValue(false);
    const filter = buildUserSearchFilter("Admin");
    expect(filter).toEqual({
      OR: [
        { name: { contains: "Admin" } },
        { email: { contains: "Admin" } },
      ],
    });
  });

  it("returns empty filter when query missing", () => {
    const filter = buildUserSearchFilter("");
    expect(filter).toEqual({});
  });
});
