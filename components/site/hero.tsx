"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = rootRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden px-4 pb-10 pt-16 sm:px-6 sm:pt-24">
      <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-brand-300/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-20 h-60 w-60 rounded-full bg-sand-300/40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div
          className={cn(
            "max-w-3xl transition-all duration-700 ease-out",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">myclawteam.ai</p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            AUTONOMOUS SOFTWARE TEAM
          </h1>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Build, ship, and scale with an AI-native engineering team that accelerates delivery while preserving
            reliability and quality.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/about">Explore The Team</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/blog">Read Insights</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
