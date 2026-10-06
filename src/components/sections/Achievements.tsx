"use client";

import { useEffect, useRef } from "react";
import { ACHIEVEMENTS, type Achievement } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import SectionHead from "@/components/ui/SectionHead";
import TechLogo, { brandTint } from "@/components/ui/TechLogo";

const css = `
.ach{position:relative;padding:0}
.ach-pin{position:sticky;top:0;height:100svh;overflow:hidden;display:flex;flex-direction:column;justify-content:center;gap:clamp(24px,5vh,56px)}
.ach-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap}
.ach-prog{width:min(240px,40vw);height:2px;background:var(--line);border-radius:2px;overflow:hidden}
.ach-prog i{display:block;height:100%;background:var(--ink);transform-origin:0;transform:scaleX(var(--ap,0))}
.ach-meta{display:flex;flex-direction:column;align-items:flex-end;gap:10px;font-family:var(--font-mono);font-size:11px;color:var(--mute)}
.ach-track{display:flex;gap:20px;padding-inline:var(--gutter);padding-block:24px;will-change:transform;transform:translate3d(var(--tx,0px),0,0);list-style:none;margin:0}
@media (min-width:1448px){.ach-track{padding-left:calc((100vw - 1320px) / 2)}}
.ach-card{flex:none;position:relative;width:min(clamp(340px,40vw,540px),calc(100vw - var(--gutter) * 2));height:clamp(260px,36vh,310px);border-radius:28px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);padding:24px;display:flex;flex-direction:column;justify-content:space-between;transition:transform .7s var(--ease),box-shadow .7s var(--ease)}
.ach-card.is-active{transform:translateY(-12px);box-shadow:inset 0 0 0 1px var(--line),0 40px 70px -36px rgba(13,13,13,.35),0 16px 28px -20px rgba(13,13,13,.18)}
.ach-top{display:flex;justify-content:space-between;align-items:flex-start}
.ach-logo{position:relative;width:72px;height:72px;border-radius:20px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);display:grid;place-items:center;color:var(--ink)}
.ach-logo::before{content:"";position:absolute;inset:-14px;border-radius:30px;background:radial-gradient(closest-side,var(--tint),transparent);opacity:.18;z-index:-1;transition:opacity .7s var(--ease)}
.ach-card.is-active .ach-logo::before{opacity:.42}
.ach-idx{font-family:var(--font-mono);font-size:12px;color:var(--mute)}
.ach-bottom{display:flex;justify-content:space-between;align-items:flex-end;gap:12px}
.ach-label{font-family:var(--font-mono);font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--mute)}
.ach-cap{margin-top:6px;font-weight:700;font-size:clamp(18px,1.6vw,22px);letter-spacing:-.03em;line-height:1.1}
.ach-detail{margin-top:6px;font-size:13px;color:var(--mute);line-height:1.4}
.ach-detail a{text-decoration:underline;text-underline-offset:3px}
.ach-num{font-weight:700;letter-spacing:-.06em;line-height:.8;font-size:clamp(72px,8vw,128px);font-variant-numeric:tabular-nums;white-space:nowrap}
.ach-num small{font-size:.42em;letter-spacing:-.03em;margin-left:2px;color:var(--mute);font-weight:600}
.ach-end{flex:none;align-self:center;display:flex;align-items:center;gap:14px;padding:0 clamp(40px,10vw,160px) 0 20px;font-family:var(--font-serif);font-style:italic;font-size:clamp(32px,4vw,56px);color:var(--mute);white-space:nowrap}
@media (max-width:699px){.ach-bottom{flex-direction:column-reverse;align-items:flex-start}.ach-num{font-size:72px}}
`;

function fmt(a: Achievement, v: number) {
  return v.toFixed(a.decimals ?? 0);
}

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!section || !pin || !track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>(".ach-card"));
    let travel = 0;
    let raf = 0;
    let lastActive = -1;

    const layout = () => {
      travel = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `${window.innerHeight + travel}px`;
      update();
    };
    const update = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, travel)));
      track.style.setProperty("--tx", `${(-p * travel).toFixed(1)}px`);
      pin.style.setProperty("--ap", p.toFixed(4));
      // card nearest the viewport centre lifts
      const cx = window.innerWidth / 2;
      let best = 0;
      let bestD = Infinity;
      cards.forEach((c, i) => {
        const b = c.getBoundingClientRect();
        const d = Math.abs(b.left + b.width / 2 - cx);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      if (best !== lastActive) {
        cards[lastActive]?.classList.remove("is-active");
        cards[best]?.classList.add("is-active");
        lastActive = best;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // count-up, once per card, the first time it is seen
    const reduced = prefersReducedMotion();
    const counted = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || counted.has(e.target)) continue;
          counted.add(e.target);
          const el = e.target.querySelector<HTMLElement>("[data-count]");
          if (!el) continue;
          const to = Number(el.dataset.count);
          const dec = Number(el.dataset.dec || 0);
          if (reduced) {
            el.textContent = to.toFixed(dec);
            continue;
          }
          const t0 = performance.now();
          const step = (t: number) => {
            const k = Math.min(1, (t - t0) / 1400);
            const eased = 1 - Math.pow(1 - k, 4);
            el.textContent = (to * eased).toFixed(dec);
            if (k < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.6 },
    );
    cards.forEach((c) => io.observe(c));

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(track);
    window.addEventListener("resize", layout);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", layout);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const total = String(ACHIEVEMENTS.length).padStart(2, "0");

  return (
    <section id="achievements" ref={sectionRef} className="ach" aria-labelledby="achievements-title">
      <style>{css}</style>
      <div ref={pinRef} className="ach-pin">
        <div className="wrap ach-head">
          <SectionHead section="achievements" label="Achievements" title="Numbers I'm" accent="proud of." id="achievements-title" />
          <div className="ach-meta" aria-hidden="true">
            <span>Scroll →</span>
            <span className="ach-prog">
              <i />
            </span>
          </div>
        </div>

        <ol ref={trackRef} className="ach-track">
          {ACHIEVEMENTS.map((a, i) => (
            <li
              key={a.id}
              className="ach-card"
              style={{ "--tint": brandTint(a.logo) ?? "#77756f" } as React.CSSProperties}
            >
              <div className="ach-top">
                <span className="ach-logo">
                  <TechLogo name={a.logo} size={a.logo === "leetcode" ? 36 : 30} decorative />
                </span>
                <span className="ach-idx" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")} / {total}
                </span>
              </div>
              <div className="ach-bottom">
                <div>
                  <p className="ach-label">{a.label}</p>
                  <h3 className="ach-cap">
                    <span className="sr-only">
                      {a.prefix}
                      {fmt(a, a.value)}
                      {a.suffix}{" "}
                    </span>
                    {a.caption}
                  </h3>
                  <p className="ach-detail">
                    {a.href ? (
                      <a href={a.href} target="_blank" rel="noopener noreferrer">
                        {a.detail}
                      </a>
                    ) : (
                      a.detail
                    )}
                  </p>
                </div>
                <p className="ach-num" aria-hidden="true">
                  {a.prefix}
                  <span data-count={a.value} data-dec={a.decimals ?? 0}>
                    {fmt(a, 0)}
                  </span>
                  {a.suffix && <small>{a.suffix}</small>}
                </p>
              </div>
            </li>
          ))}
          <li className="ach-end" aria-hidden="true">
            and counting <span>→</span>
          </li>
        </ol>
      </div>
    </section>
  );
}
