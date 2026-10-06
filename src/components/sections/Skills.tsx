"use client";

import { useEffect, useState } from "react";
import { FAMILIES, SKILLS, usedIn, type Family } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import SectionHead from "@/components/ui/SectionHead";
import TechLogo, { brandTint, isBrand } from "@/components/ui/TechLogo";

const css = `
.sk-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:24px}
.sk-filters{display:flex;flex-wrap:wrap;gap:8px;margin-top:40px}
.sk-chip{height:36px;padding:0 15px;border-radius:999px;font-size:13.5px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.14);color:var(--ink-2);transition:background-color .4s var(--ease),color .4s var(--ease),box-shadow .4s var(--ease)}
.sk-chip:hover{box-shadow:inset 0 0 0 1px var(--ink);color:var(--ink)}
.sk-chip[aria-pressed="true"]{background:var(--ink);color:#fff;box-shadow:inset 0 0 0 1px var(--ink)}
.sk-chip small{font-family:var(--font-mono);font-size:10.5px;margin-left:6px;opacity:.6}
.sk-body{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:clamp(20px,2.4vw,36px);margin-top:28px;align-items:start}
.sk-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px;list-style:none;margin:0;padding:0}
.sk-tile{position:relative;width:100%;aspect-ratio:1/1.08;border-radius:14px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);text-align:left;padding:9px 10px;display:flex;flex-direction:column;overflow:hidden;
  opacity:0;transform:translateY(16px) scale(.94);
  transition:opacity .7s var(--ease),transform .8s var(--ease),background-color .35s var(--ease),color .35s var(--ease),box-shadow .5s var(--ease),filter .4s;
  transition-delay:calc(var(--d8) * 40ms),calc(var(--d8) * 40ms),0s,0s,0s,0s}
.sk-grid.is-in .sk-tile{opacity:1;transform:none}
.sk-grid.is-in .sk-tile.is-dim{opacity:.22;filter:grayscale(1)}
.sk-tile:hover,.sk-tile:focus-visible{box-shadow:inset 0 0 0 1px var(--ink),0 18px 30px -18px rgba(13,13,13,.4);transform:translateY(-3px)}
.sk-grid.is-in .sk-tile:hover{transform:translateY(-3px)}
.sk-grid.is-done .sk-tile{transition-delay:calc(var(--d8) * 30ms),0s,0s,0s,0s,0s}
.sk-tile.is-active{background:var(--ink);color:#fff;box-shadow:0 18px 30px -16px rgba(13,13,13,.55)}
.sk-n{font-family:var(--font-mono);font-size:10.5px;color:var(--mute)}
.sk-tile.is-active .sk-n,.sk-tile.is-active .sk-fam{color:rgba(255,255,255,.6)}
.sk-sym{margin-top:auto;font-weight:700;font-size:clamp(22px,2.3vw,34px);letter-spacing:-.04em;line-height:1}
.sk-name{margin-top:4px;font-size:11.5px;font-weight:500;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sk-fam{font-family:var(--font-mono);font-size:9px;letter-spacing:.04em;text-transform:uppercase;color:var(--faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.sk-insp{position:sticky;top:96px;padding:22px;border-radius:26px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line),var(--shadow-soft);min-height:460px;display:flex;flex-direction:column}
.sk-insp-top{display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:11px;color:var(--mute)}
.sk-logo{position:relative;height:190px;display:grid;place-items:center;margin-top:8px}
.sk-logo::before{content:"";position:absolute;width:190px;height:190px;border-radius:50%;background:radial-gradient(closest-side,var(--tint,transparent),transparent);opacity:.22;filter:blur(8px)}
.sk-logo > *{position:relative;animation:pop .7s var(--ease) both}
.sk-concept{color:var(--ink)}
@keyframes pop{from{opacity:0;transform:scale(.6) rotate(-8deg)}60%{opacity:1}to{opacity:1;transform:none}}
.sk-insp h3{font-weight:700;font-size:28px;letter-spacing:-.04em;line-height:1.05;margin-top:10px}
.sk-insp-fam{font-family:var(--font-mono);font-size:11.5px;color:var(--mute);margin-top:6px;text-transform:uppercase;letter-spacing:.05em}
.sk-insp-used{margin-top:18px;padding-top:14px;border-top:1px solid var(--line)}
.sk-insp-used p{font-family:var(--font-mono);font-size:10.5px;color:var(--mute);text-transform:uppercase;letter-spacing:.06em}
.sk-insp-used ul{list-style:none;padding:0;margin:10px 0 0;display:flex;flex-wrap:wrap;gap:6px}
.sk-note{margin-top:auto;padding-top:16px;font-size:11px;color:var(--mute);display:flex;align-items:center;gap:6px}
@media (max-width:1079px){.sk-body{grid-template-columns:minmax(0,1fr)}.sk-insp{position:relative;top:0;min-height:0}}
@media (max-width:699px){
  .sk-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
  .sk-tile{transition-delay:calc(var(--d4) * 40ms),calc(var(--d4) * 40ms),0s,0s,0s,0s;padding:8px}
  .sk-sym{font-size:24px}
  .sk-logo{height:170px}
}
`;

export default function Skills() {
  const [family, setFamily] = useState<Family | "All">("All");
  const [activeN, setActiveN] = useState(SKILLS[0].n);
  const [gridRef, inView] = useInView<HTMLUListElement>({ threshold: 0.15 });
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setDone(true), 1600);
    return () => clearTimeout(t);
  }, [inView]);
  const active = SKILLS.find((s) => s.n === activeN) ?? SKILLS[0];
  const used = usedIn(active.name);
  const brand = isBrand(active.logo);

  const pickFamily = (f: Family | "All") => {
    setFamily(f);
    if (f !== "All" && active.family !== f) {
      const first = SKILLS.find((s) => s.family === f);
      if (first) setActiveN(first.n);
    }
  };

  return (
    <section id="skills" className="section cv" aria-labelledby="skills-title">
      <style>{css}</style>
      <div className="wrap">
        <div className="sk-head">
          <SectionHead section="skills" label="Skills" title="The periodic table of my" accent="stack." id="skills-title" />
          <p className="lede rv" style={{ maxWidth: 360 }}>
            {SKILLS.length} elements from my résumé. Hover or focus a tile to inspect it.
          </p>
        </div>

        <div className="sk-filters rv" role="group" aria-label="Filter skills by family">
          {(["All", ...FAMILIES] as const).map((f) => (
            <button key={f} className="sk-chip" aria-pressed={family === f} onClick={() => pickFamily(f)}>
              {f}
              <small>{f === "All" ? SKILLS.length : SKILLS.filter((s) => s.family === f).length}</small>
            </button>
          ))}
        </div>

        <div className="sk-body">
          <ul ref={gridRef} className={`sk-grid${inView ? " is-in" : ""}${done ? " is-done" : ""}`} aria-label="Skills">
            {SKILLS.map((s, i) => {
              const d8 = Math.floor(i / 8) + (i % 8);
              const d4 = Math.floor(i / 4) + (i % 4);
              const dim = family !== "All" && s.family !== family;
              return (
                <li key={s.n}>
                  <button
                    className={`sk-tile${s.n === active.n ? " is-active" : ""}${dim ? " is-dim" : ""}`}
                    style={{ "--d8": d8, "--d4": d4 } as React.CSSProperties}
                    onMouseEnter={() => setActiveN(s.n)}
                    onFocus={() => setActiveN(s.n)}
                    onClick={() => setActiveN(s.n)}
                    aria-label={`${s.name}, ${s.family}${s.detail ? `, ${s.detail}` : ""}`}
                    aria-controls="skill-inspector"
                  >
                    <span className="sk-n">{String(s.n).padStart(2, "0")}</span>
                    <span className="sk-sym" aria-hidden="true">
                      {s.symbol}
                    </span>
                    <span className="sk-name" aria-hidden="true">
                      {s.name}
                    </span>
                    <span className="sk-fam" aria-hidden="true">
                      {s.family}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <aside id="skill-inspector" className="sk-insp" aria-label="Skill inspector">
            <div className="sk-insp-top">
              <span>No. {String(active.n).padStart(2, "0")}</span>
              <span>{active.symbol}</span>
            </div>
            <div className="sk-logo" style={{ "--tint": brandTint(active.logo) ?? "#0d0d0d" } as React.CSSProperties}>
              <TechLogo
                key={active.n}
                name={active.logo}
                size={brand ? 150 : 130}
                decorative
                className={brand ? undefined : "sk-concept"}
                strokeWidth={1.6}
              />
            </div>
            <h3>{active.name}</h3>
            <p className="sk-insp-fam">
              {active.family}
              {active.detail ? ` · ${active.detail}` : ""}
            </p>
            <div className="sk-insp-used">
              <p>Used in</p>
              {used.length ? (
                <ul>
                  {used.map((u) => (
                    <li key={u} className="chip">
                      {u}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul>
                  <li className="chip">Listed under Technical Skills</li>
                </ul>
              )}
            </div>
            <p className="sk-note">{brand ? "Official logo, used for identification only." : "Concept: custom line icon."}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
