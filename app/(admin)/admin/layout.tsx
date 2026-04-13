import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30 md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
      <AdminSidebar />
      <main className="min-w-0 px-4 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
