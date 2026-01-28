import { auth } from "@/features/auth/server/auth";
import { getUsers } from "@/features/users/queries/get-users";
import { UsersTable } from "@/features/users/components/users-table";
import { ADMIN_ROLE } from "@/shared/auth/roles";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function UsersPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  if (session.user.role !== ADMIN_ROLE) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <p className="text-lg font-semibold">Access restricted</p>
        <p className="text-sm text-muted-foreground">
          Only administrators can manage users. Reach out to your administrator if you need access.
        </p>
      </div>
    );
  }

  const toNumber = (value: string | string[] | undefined) => {
    if (!value || Array.isArray(value)) return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const query = {
    page: toNumber(resolvedSearchParams.page),
    pageSize: toNumber(resolvedSearchParams.pageSize),
    q: typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : undefined,
    sort: (resolvedSearchParams.sort as "createdAt" | "name") ?? "createdAt",
    order: (resolvedSearchParams.order as "asc" | "desc") ?? "desc",
  };

  const data = await getUsers(query);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-muted-foreground">Manage accounts, roles, and access.</p>
      </div>
      <UsersTable data={data} query={query} />
    </div>
  );
}
