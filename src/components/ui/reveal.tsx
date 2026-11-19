"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";
import { resolveRevealState } from "@/lib/site/reveal-state";
import type { RevealState } from "@/lib/site/reveal-state";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li";
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const OBSERVER_MARGIN = "0px 0px -10% 0px";

export function Reveal({ children, delay, className, as = "div" }: RevealProps) {
  const Tag: ElementType = as;
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<RevealState>("visible");

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const initiallyInViewport = element.getBoundingClientRect().top < window.innerHeight;
    const initialState = resolveRevealState({ reducedMotion, initiallyInViewport, intersecting: false });
    setState(initialState);
    if (initialState === "visible") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setState(resolveRevealState({ reducedMotion, initiallyInViewport, intersecting: true }));
          observer.disconnect();
        }
      },
      { rootMargin: OBSERVER_MARGIN },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const style = delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined;

  return (
    <Tag ref={ref} data-reveal={state} className={className} style={style}>
      {children}
    </Tag>
  );
}
