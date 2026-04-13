"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogout() {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await signOut({ callbackUrl: "/login", redirect: true });
    } catch {
      setErrorMessage("Unable to log out. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" className={className} onClick={handleLogout} disabled={isSubmitting}>
        {isSubmitting ? "Signing out..." : "Sign out"}
      </Button>
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
    </div>
  );
}
