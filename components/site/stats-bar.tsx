"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const STATS = [
  { value: "20M+", label: "Workflow Runs" },
  { value: "46%", label: "Faster Delivery" },
  { value: "55%", label: "Lower Defect Rate" },
  { value: "90%", label: "Automated Coverage" },
] as const;

export function StatsBar() {
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
      { threshold: 0.25 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="px-4 pb-20 sm:px-6">
      <div
        ref={rootRef}
        className="mx-auto max-w-6xl rounded-xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((item, index) => (
            <div
              key={item.value}
              className={cn(
                "rounded-lg border border-border bg-background px-4 py-5 transition-all duration-700",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              )}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <p className="text-3xl font-semibold tracking-tight text-foreground">{item.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
