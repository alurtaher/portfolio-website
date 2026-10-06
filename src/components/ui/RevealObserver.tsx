"use client";

import { useEffect } from "react";

/** Adds .is-in to every .rv / .rv-mask once it scrolls into view. Animates once. */
export default function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    const scan = () =>
      document.querySelectorAll(".rv:not(.is-in), .rv-mask:not(.is-in)").forEach((el) => io.observe(el));
    scan();
    // pick up nodes rendered later (e.g. mobile menu, filtered tiles)
    let t = 0;
    const mo = new MutationObserver(() => {
      clearTimeout(t);
      t = window.setTimeout(scan, 120);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      clearTimeout(t);
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
