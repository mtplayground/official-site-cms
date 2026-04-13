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
    <aside className="w-full border-b border-border bg-card md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex h-full flex-col">
        <div className="border-b border-border px-5 py-4 md:py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Admin</p>
          <p className="text-base font-semibold text-foreground">official-site-cms</p>
        </div>

        <nav className="grid grid-cols-2 gap-1 p-3 sm:grid-cols-4 md:flex md:flex-1 md:flex-col md:space-y-1 md:p-3">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-md px-3 py-2 text-center text-sm font-medium transition-colors md:text-left",
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

        <div className="border-t border-border p-3 md:mt-auto">
          <LogoutButton className="w-full" />
        </div>
      </div>
    </aside>
  );
}
