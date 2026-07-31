"use client";

import { useEffect, useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface RevealProps {
  children: ReactNode;
  /** Stagger position within a grid. Each step adds 60ms. */
  index?: number;
  className?: string;
  as?: ElementType;
}

// useLayoutEffect warns during SSR. On the server there is nothing to reveal.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Fade in and rise 16px as the element enters the viewport, staggered 60ms per
 * item. DESIGN.md Section 5.
 *
 * The server renders the content already visible. The hidden state is applied
 * on the client before paint, so content is never hidden from crawlers, from
 * answer engines, or from a visitor with JavaScript disabled.
 *
 * prefers-reduced-motion skips the whole mechanism, leaving content in place.
 */
export function Reveal({ children, index = 0, className, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || typeof IntersectionObserver === "undefined") return;

    node.dataset.reveal = "pending";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = "shown";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn("reveal", className)}
      style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
