"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type CopyUrlButtonProps = {
  url: string;
};

export function CopyUrlButton({ url }: CopyUrlButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
      {copied ? "Copied" : "Copy URL"}
    </Button>
  );
}
