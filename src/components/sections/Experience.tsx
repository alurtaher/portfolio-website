"use client";

import { useRef } from "react";
import { TIMELINE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";
import SectionHead from "@/components/ui/SectionHead";

const css = `
.tl-wrap{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(32px,6vw,96px);align-items:start}
.tl-side{position:sticky;top:120px}
.tl-side p{margin-top:24px;max-width:380px}
.tl{position:relative}
.tl ol{list-style:none;margin:0;padding:0}
.tl::before,.tl-fill{content:"";position:absolute;left:11px;top:8px;bottom:8px;width:2px;border-radius:2px}
.tl::before{background:var(--line)}
.tl-fill{background:var(--ink);transform-origin:50% 0;transform:scaleY(var(--tp,0))}
.tl-item{position:relative;padding:0 0 56px 56px}
.tl-dot{position:absolute;left:4px;top:4px;width:16px;height:16px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 2px var(--faint);transition:box-shadow .5s var(--ease),background-color .5s var(--ease),transform .6s var(--ease)}
.tl-item.is-lit .tl-dot{background:var(--ink);box-shadow:inset 0 0 0 2px var(--ink),0 0 0 6px rgba(13,13,13,.08);transform:scale(1.1)}
.tl-year{font-family:var(--font-mono);font-size:12px;color:var(--mute);display:flex;gap:10px;align-items:center;transition:color .5s var(--ease)}
.tl-kind{padding:2px 8px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line);font-size:10px;text-transform:uppercase;letter-spacing:.06em}
.tl-title{margin-top:10px;font-weight:700;letter-spacing:-.035em;line-height:1.05;font-size:clamp(24px,2.4vw,34px);color:#85827b;transition:color .6s var(--ease)}
.tl-place{margin-top:6px;font-size:15px;color:var(--mute);transition:color .6s var(--ease)}
.tl-detail{list-style:none;padding:0;margin:14px 0 0;display:grid;gap:8px;transform:translateY(8px);transition:opacity .7s var(--ease),transform .8s var(--ease)}
.tl-detail li{font-size:14.5px;line-height:1.55;color:var(--mute);transition:color .6s var(--ease);padding-left:16px;position:relative}
.tl-detail li::before{content:"";position:absolute;left:0;top:.7em;width:7px;height:1.5px;background:var(--ink)}
.tl-item.is-lit .tl-year{color:var(--ink)}
.tl-item.is-lit .tl-title{color:var(--ink)}
.tl-item.is-lit .tl-place{color:var(--mute)}
.tl-item.is-lit .tl-detail{opacity:1;transform:none}
.tl-item.is-lit .tl-detail li{color:var(--ink-2)}
.tl-next{margin-left:56px;border:1.5px dashed rgba(13,13,13,.22);border-radius:24px;padding:24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.tl-next p{font-weight:700;font-size:clamp(22px,2.2vw,30px);letter-spacing:-.035em}
.tl-next p span{font-family:var(--font-mono);font-weight:400;font-size:12px;letter-spacing:0;color:var(--mute);display:block;margin-bottom:4px}
.tl-next em{font-family:var(--font-serif);font-weight:400;color:var(--mute)}
@media (max-width:899px){.tl-wrap{grid-template-columns:minmax(0,1fr)}.tl-side{position:static}.tl-item{padding-left:44px}.tl-next{margin-left:44px}}
`;

export default function Experience() {
  const listRef = useRef<HTMLDivElement | null>(null);

  const sectionRef = useScrollProgress<HTMLDivElement>((p) => {
    const list = listRef.current;
    if (!list) return;
    list.style.setProperty("--tp", p.toFixed(4));
    const reach = p * list.offsetHeight;
    list.querySelectorAll<HTMLElement>(".tl-item").forEach((li) => {
      li.classList.toggle("is-lit", li.offsetTop <= reach + 4);
    });
  }, "center");

  return (
    <section id="experience" className="section cv" aria-labelledby="experience-title">
      <style>{css}</style>
      <div className="wrap tl-wrap">
        <div className="tl-side">
          <SectionHead section="experience" label="Experience" title="Education & work, one" accent="path." id="experience-title" />
          <p className="lede rv">
            From an M.Tech in Computer Science to mentoring and full-stack AI work, in order.
          </p>
        </div>

        <div ref={sectionRef}>
          <div ref={listRef} className="tl">
            <span className="tl-fill" aria-hidden="true" />
            <ol>
            {TIMELINE.map((t) => (
              <li key={t.title + t.start} className="tl-item">
                <span className="tl-dot" aria-hidden="true" />
                <p className="tl-year">
                  <time>{t.period}</time>
                  <span className="tl-kind">{t.kind}</span>
                </p>
                <h3 className="tl-title">{t.title}</h3>
                <p className="tl-place">{t.place}</p>
                <ul className="tl-detail">
                  {t.detail.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </li>
            ))}
            </ol>
          </div>
          <div className="tl-next rv">
            <p>
              <span>Next</span>
              Your <em>team?</em>
            </p>
            <a
              href="#contact"
              className="btn btn-primary btn-sm"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("contact");
              }}
            >
              Let&apos;s talk <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
