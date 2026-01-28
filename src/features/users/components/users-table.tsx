"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Settings2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { TablePagination } from "@/shared/ui/pagination";
import { UserFormDialog } from "@/features/users/components/user-form-dialog";
import { UserDeleteDialog } from "@/features/users/components/user-delete-dialog";
import { type UsersResponse } from "@/features/users/types";
import { type UserQueryInput } from "@/features/users/schemas";
import { formatDate } from "@/shared/lib/date";
import { mergeQueryParams } from "@/shared/lib/query-builder";
import { cn } from "@/shared/lib/utils";

type Props = {
  data: UsersResponse;
  query: UserQueryInput;
};

const pageSizes = [10, 20, 30, 50];

export function UsersTable({ data, query }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(query.q ?? "");

  const sortLabel = useMemo(() => {
    if (query.order === "asc") {
      return "Oldest first";
    }
    return "Newest first";
  }, [query.order]);

  const updateQuery = (updates: Record<string, string | number | undefined | null>) => {
    const merged = mergeQueryParams(new URLSearchParams(searchParams.toString()), updates);
    router.push(`${pathname}?${merged.toString()}`, { scroll: false });
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateQuery({ q: searchValue || null, page: 1 });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <form onSubmit={handleSearch} className="flex w-full items-center gap-2 lg:max-w-md">
          <Input
            placeholder="Search by name or email"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <Button type="submit">
            Search
          </Button>
        </form>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2 className="mr-2 h-4 w-4" />
                {sortLabel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => updateQuery({ sort: "createdAt", order: "desc" })}>
                Newest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateQuery({ sort: "createdAt", order: "asc" })}>
                Oldest first
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={(query.pageSize ?? 10).toString()}
            onChange={(event) => updateQuery({ pageSize: event.target.value, page: 1 })}
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
          <UserFormDialog
            mode="create"
            trigger={
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create
              </Button>
            }
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className={cn("rounded-full bg-secondary px-2 py-1 text-xs font-semibold")}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <UserFormDialog
                    mode="edit"
                    defaultValues={{
                      id: user.id,
                      email: user.email,
                      name: user.name,
                      role: user.role,
                    }}
                    trigger={
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    }
                  />
                  <UserDeleteDialog
                    userId={user.id}
                    trigger={
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
            {data.items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={(page) => updateQuery({ page })}
        />
      </div>
    </div>
  );
}
