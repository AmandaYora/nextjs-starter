"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { type UserRole } from "@/shared/auth/roles";

const ICONS = {
  dashboard: LayoutDashboard,
  users: Users,
} as const;

export type SidebarIconName = keyof typeof ICONS;

export type SidebarItem = {
  href: string;
  label: string;
  roles?: UserRole[];
  icon?: SidebarIconName;
};

type Props = {
  items: SidebarItem[];
  role: UserRole;
};

export function SidebarNav({ items, role }: Props) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1.5">
      {items
        .filter((item) => !item.roles || item.roles.includes(role))
        .map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon ? ICONS[item.icon] : undefined;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                "text-muted-foreground hover:bg-muted/70 hover:text-foreground dark:hover:bg-muted/30",
                isActive &&
                  "bg-muted text-foreground shadow-sm ring-1 ring-border dark:bg-muted/40 dark:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {Icon && (
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
              )}
              <span className="sidebar-nav__label">{item.label}</span>
            </Link>
          );
        })}
    </nav>
  );
}
