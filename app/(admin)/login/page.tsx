import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LoginForm } from "@/components/admin/login-form";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
          <p className="text-sm text-muted-foreground">Sign in to access the admin dashboard.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
