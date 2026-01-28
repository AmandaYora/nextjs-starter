import Link from "next/link";
import { ReactNode } from "react";
import { logoutAction } from "@/features/auth/server/logout-action";
import { SessionUser } from "@/features/auth/types";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { SidebarCollapseToggle } from "@/app/(dashboard)/_components/sidebar-collapse-toggle";
import { SidebarNav, type SidebarItem } from "@/shared/ui/sidebar-nav";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { ADMIN_ROLE } from "@/shared/auth/roles";

type NavItem = SidebarItem;

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: "dashboard" },
  { href: "/dashboard/users", label: "Users management", roles: [ADMIN_ROLE], icon: "users" },
];

type Props = {
  user: SessionUser;
  children: ReactNode;
};

export function DashboardShell({ user, children }: Props) {
  const userInitials = user.name
    ? user.name
        .split(" ")
        .map((part) => part.charAt(0))
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : user.email.charAt(0).toUpperCase();

  const formattedRole = user.role
    .toLowerCase()
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
  const firstName = user.name?.split(" ")[0] ?? user.name;

  return (
    <div className="flex min-h-screen bg-muted/20 text-foreground">
      <aside className="dashboard-sidebar hidden shrink-0 flex-col border-r border-border/80 bg-background/95 px-4 py-8 transition-all duration-300 lg:flex lg:w-72">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-base font-semibold text-primary-foreground">
            PS
          </div>
          <div className="dashboard-sidebar__details space-y-0.5">
            <p className="text-sm font-semibold">Pro Starter</p>
            <p className="text-xs text-muted-foreground">Admin Workspace</p>
          </div>
        </Link>
        <div className="dashboard-sidebar__details mt-8 space-y-4 rounded-2xl border border-border/80 bg-card/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Signed in as</p>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {userInitials}
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <Badge variant="outline" className="dashboard-sidebar__badge mt-1 capitalize">
                {formattedRole}
              </Badge>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <p className="dashboard-sidebar__details text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Navigation
          </p>
          <div className="mt-3">
            <SidebarNav items={navItems} role={user.role} />
          </div>
        </div>
      </aside>
      <div className="flex w-full flex-1 flex-col">
        <header className="border-b border-border/80 bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <SidebarCollapseToggle />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Dashboard</p>
                <h1 className="text-2xl font-semibold leading-tight">Welcome back, {firstName}.</h1>
                <p className="text-sm text-muted-foreground">
                  Stay on top of user activity and system performance.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <form action={logoutAction}>
                <Button type="submit" variant="outline" size="sm" className="rounded-full">
                  Sign out
                </Button>
              </form>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-6xl">
            <div className="rounded-3xl border border-border/80 bg-background/95 p-6 shadow-sm">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
