import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { getSiteUrl } from "@/lib/structured-data";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "myclawteam.ai",
    template: "%s | myclawteam.ai",
  },
  description: "Autonomous software team delivering production-ready AI-powered engineering workflows.",
  openGraph: {
    title: "myclawteam.ai",
    description: "Autonomous software team delivering production-ready AI-powered engineering workflows.",
    url: siteUrl,
    siteName: "myclawteam.ai",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "myclawteam.ai",
    description: "Autonomous software team delivering production-ready AI-powered engineering workflows.",
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
