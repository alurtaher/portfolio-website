"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { scrollToTarget, setScrollLocked } from "@/lib/scroll";

const css = `
.nav{position:fixed;inset:0 0 auto;z-index:50;pointer-events:none}
.nav-progress{position:fixed;top:0;left:0;height:2px;width:100%;background:var(--ink);transform-origin:0 50%;transform:scaleX(var(--p,0));z-index:60;pointer-events:none}
.nav-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding-top:18px}
.nav-brand{pointer-events:auto;display:flex;align-items:center;gap:12px;border-radius:999px}
.nav-mark{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-family:var(--font-mono);font-size:13px;font-weight:600;letter-spacing:-.02em;box-shadow:inset 0 0 0 1.5px var(--ink);color:var(--ink);background:transparent;transition:background-color .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
.nav-brand:hover .nav-mark{transform:rotate(360deg)}
.nav.is-scrolled .nav-mark{background:var(--ink);color:#fff}
.nav-name{font-weight:600;letter-spacing:-.02em;font-size:15px;white-space:nowrap;transition:opacity .5s var(--ease),transform .6s var(--ease)}
.nav.is-scrolled .nav-name{opacity:0;transform:translateX(-8px);pointer-events:none}
.nav-pill{pointer-events:auto;position:relative;display:flex;align-items:center;gap:2px;padding:5px;border-radius:999px;transition:background-color .5s var(--ease),box-shadow .5s var(--ease),backdrop-filter .5s}
.nav.is-scrolled .nav-pill,.nav-menu-btn{background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line),0 10px 30px -18px rgba(13,13,13,.35)}
.nav-link{position:relative;z-index:1;height:36px;padding:0 15px;display:inline-flex;align-items:center;border-radius:999px;font-size:14px;font-weight:500;color:var(--ink-2);transition:color .45s var(--ease)}
.nav-link:hover{color:var(--ink)}
.nav-link[aria-current="true"]{color:#fff}
.nav-ind{position:absolute;z-index:0;top:5px;height:36px;border-radius:999px;background:var(--ink);transition:transform .6s var(--ease),width .6s var(--ease),opacity .3s;pointer-events:none}
.nav-menu-btn{pointer-events:auto;display:none;height:44px;padding:0 18px;border-radius:999px;font-size:14px;font-weight:500;align-items:center;gap:10px}
.nav-menu-btn i{display:block;width:16px;height:1.5px;background:currentColor;position:relative}
.nav-menu-btn i::after{content:"";position:absolute;left:0;top:5px;width:10px;height:1.5px;background:currentColor}
@media (max-width:899px){.nav-pill{display:none}.nav-menu-btn{display:inline-flex}}
.menu{position:fixed;inset:0;z-index:70;background:var(--paper);clip-path:circle(0% at calc(100% - 60px) 40px);visibility:hidden;transition:clip-path .8s var(--ease),visibility 0s .8s;display:flex;flex-direction:column}
.menu.is-open{clip-path:circle(150% at calc(100% - 60px) 40px);visibility:visible;transition:clip-path .9s var(--ease),visibility 0s}
.menu-top{display:flex;justify-content:space-between;align-items:center;padding-top:18px}
.menu-list{list-style:none;margin:auto 0;padding:0;display:flex;flex-direction:column;gap:clamp(6px,1.4vh,14px)}
.menu-link{display:flex;align-items:baseline;gap:16px;font-weight:700;letter-spacing:-.045em;font-size:clamp(40px,11vw,76px);line-height:1;opacity:0;transform:translateY(30px);transition:opacity .6s var(--ease),transform .8s var(--ease)}
.menu-link small{font-family:var(--font-mono);font-size:12px;font-weight:400;letter-spacing:0;color:var(--mute)}
.menu.is-open .menu-link{opacity:1;transform:none;transition-delay:calc(.18s + var(--i) * 60ms)}
.menu-link[aria-current="true"] span{font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-.02em}
.menu-foot{padding-bottom:28px;display:flex;flex-wrap:wrap;gap:10px 18px;font-size:14px;color:var(--mute)}
`;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // scrolled state + top progress bar
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current?.style.setProperty("--p", String(max > 0 ? y / max : 0));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // active section tracking
  useEffect(() => {
    const ids = ["hero", ...NAV.map((n) => n.id)];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id === "hero" ? "" : e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // slide the ink indicator under the active link
  const placeIndicator = useCallback(() => {
    const pill = pillRef.current;
    const ind = indRef.current;
    if (!pill || !ind) return;
    const link = pill.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!link) {
      ind.style.opacity = "0";
      return;
    }
    ind.style.opacity = "1";
    ind.style.width = `${link.offsetWidth}px`;
    ind.style.transform = `translateX(${link.offsetLeft - 5}px)`;
    ind.style.left = "5px";
  }, [active]);

  useLayoutEffect(() => {
    placeIndicator();
  }, [placeIndicator]);

  useEffect(() => {
    window.addEventListener("resize", placeIndicator);
    document.fonts?.ready.then(placeIndicator);
    return () => window.removeEventListener("resize", placeIndicator);
  }, [placeIndicator]);

  // mobile menu: lock scroll, Esc closes, focus management
  useEffect(() => {
    if (!open) return;
    setScrollLocked(true);
    const first = menuRef.current?.querySelector<HTMLElement>("button, a");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && menuRef.current) {
        const f = menuRef.current.querySelectorAll<HTMLElement>("a, button");
        const a = f[0];
        const b = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          b.focus();
        } else if (!e.shiftKey && document.activeElement === b) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const btn = menuBtnRef.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      setScrollLocked(false);
      btn?.focus({ preventScroll: true });
    };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // wait one frame so the scroll lock is released before scrolling
    requestAnimationFrame(() => scrollToTarget(id));
  };

  return (
    <>
      <style>{css}</style>
      <div ref={progressRef} className="nav-progress" aria-hidden="true" />
      <nav className={`nav${scrolled ? " is-scrolled" : ""}`} aria-label="Primary">
        <div className="wrap nav-bar">
          <a href="#hero" className="nav-brand" onClick={go("hero")}>
            <span className="nav-mark" aria-hidden="true">
              {PROFILE.initials}
            </span>
            <span className="nav-name">{PROFILE.name}</span>
            <span className="sr-only">, back to top</span>
          </a>

          <div ref={pillRef} className="nav-pill">
            <span ref={indRef} className="nav-ind" aria-hidden="true" style={{ opacity: 0 }} />
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                data-id={n.id}
                className="nav-link"
                aria-current={active === n.id ? "true" : undefined}
                onClick={go(n.id)}
              >
                {n.label}
              </a>
            ))}
          </div>

          <button
            ref={menuBtnRef}
            className="nav-menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            Menu <i aria-hidden="true" />
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        ref={menuRef}
        className={`menu${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="wrap menu-top">
          <span className="nav-brand">
            <span className="nav-mark" aria-hidden="true">
              {PROFILE.initials}
            </span>
            <span className="nav-name">{PROFILE.name}</span>
          </span>
          <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <ul className="wrap menu-list">
          {NAV.map((n, i) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className="menu-link"
                style={{ "--i": i } as React.CSSProperties}
                aria-current={active === n.id ? "true" : undefined}
                onClick={go(n.id)}
              >
                <small>{String(i + 1).padStart(2, "0")}</small>
                <span>{n.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="wrap menu-foot">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <span>{PROFILE.location}</span>
        </div>
      </div>
    </>
  );
}
