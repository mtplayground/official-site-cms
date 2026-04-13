"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/admin/logout-button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Blog Posts" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/media", label: "Media" },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-r border-border bg-card md:min-h-screen md:w-64">
      <div className="flex h-full flex-col">
        <div className="border-b border-border px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Admin</p>
          <p className="text-base font-semibold text-foreground">official-site-cms</p>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <LogoutButton className="w-full" />
        </div>
      </div>
    </aside>
  );
}
