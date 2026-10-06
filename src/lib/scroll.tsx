"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { prefersReducedMotion } from "./hooks";

let lenisInstance: Lenis | null = null;

/** Scroll to an element id (or "top"), through Lenis when it is running. */
export function scrollToTarget(target: string | number, opts: { offset?: number } = {}) {
  const offset = opts.offset ?? 0;
  const el =
    typeof target === "number" || target === "top"
      ? null
      : document.getElementById(target.replace(/^#/, ""));
  const dest = typeof target === "number" ? target : target === "top" ? 0 : el;
  if (dest === null) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(dest as HTMLElement | number, {
      offset,
      duration: 1.3,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
  } else {
    const y = typeof dest === "number" ? dest : dest.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
  // move focus for keyboard / screen-reader users without a second jump
  if (el) {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}

export function getLenis() {
  return lenisInstance;
}

/** Lock / unlock page scroll (mobile menu). */
export function setScrollLocked(locked: boolean) {
  if (lenisInstance) {
    if (locked) lenisInstance.stop();
    else lenisInstance.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: false });
    lenisInstance = lenis;
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
