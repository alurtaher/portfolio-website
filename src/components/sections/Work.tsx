"use client";

import { useState } from "react";
import { PROJECTS, SKILLS } from "@/lib/data";
import SectionHead from "@/components/ui/SectionHead";
import TechLogo from "@/components/ui/TechLogo";
import MiniUI, { miniCss } from "@/components/ui/MiniUI";

const N = PROJECTS.length;
const OPEN = 8;

const css = `
.wk-row{--n:${N};--g:12px;display:flex;gap:var(--g);height:min(78svh,600px);margin-top:56px;container-type:inline-size}
.wk-panel{position:relative;flex:1 1 0;min-width:0;border-radius:28px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;transition:flex-grow .9s var(--ease),box-shadow .6s var(--ease)}
.wk-panel.is-open{flex-grow:${OPEN};box-shadow:inset 0 0 0 1px var(--line),var(--shadow-soft)}
.wk-panel:has(.wk-spine:focus-visible){outline:2px solid var(--ink);outline-offset:3px}
.wk-spine{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:22px 0;text-align:center;transition:opacity .4s var(--ease)}
.wk-spine:focus-visible{outline:none}
.wk-panel.is-open .wk-spine{opacity:0;pointer-events:none}
.wk-spine-n{font-family:var(--font-mono);font-size:12px;color:var(--mute)}
.wk-spine-t{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:700;font-size:clamp(18px,1.7vw,24px);letter-spacing:-.03em;white-space:nowrap}
.wk-plus{width:40px;height:40px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(13,13,13,.18);display:grid;place-items:center;font-size:20px;font-weight:300;transition:transform .6s var(--ease),background-color .4s,color .4s}
.wk-spine:hover .wk-plus{transform:rotate(90deg);background:var(--ink);color:#fff}
.wk-content{position:absolute;top:0;left:0;bottom:0;width:calc((100cqw - var(--g) * (var(--n) - 1)) * ${OPEN} / (${OPEN} + var(--n) - 1));display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:clamp(20px,2.4vw,40px);padding:clamp(22px,2.6vw,40px);opacity:0;visibility:hidden;transition:opacity .4s var(--ease),visibility 0s .4s}
.wk-panel.is-open .wk-content{opacity:1;visibility:visible;transition:opacity .7s var(--ease) .25s,visibility 0s}
.wk-text{display:flex;flex-direction:column;min-width:0}
.wk-kick{display:flex;gap:12px;align-items:center;font-family:var(--font-mono);font-size:11.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--mute)}
.wk-kick b{color:var(--ink);font-weight:500}
.wk-title{margin-top:12px;font-weight:700;letter-spacing:-.045em;line-height:1;font-size:clamp(26px,2.6vw,40px)}
.wk-desc{margin-top:12px;font-size:14.5px;line-height:1.55;color:var(--ink-2)}
.wk-feats{list-style:none;padding:0;margin:16px 0 0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 18px}
.wk-feats li{font-size:12.5px;line-height:1.35;padding-left:14px;position:relative;color:var(--ink-2)}
.wk-feats li::before{content:"";position:absolute;left:0;top:.5em;width:6px;height:6px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--ink)}
.wk-tech{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto;padding-top:14px;list-style:none;padding-left:0}
.wk-cta{margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.wk-cta small{font-family:var(--font-mono);font-size:11px;color:var(--mute)}
.wk-ui{position:relative;min-width:0;display:flex;flex-direction:column}
.wk-ui-in{flex:1;min-height:0;clip-path:inset(0 100% 0 0 round 20px);transition:clip-path 1.1s var(--ease) .1s}
.wk-panel.is-open .wk-ui-in{clip-path:inset(0 0 0 0 round 20px);transition-delay:.35s}
.wk-ui-label{margin-top:10px;font-family:var(--font-mono);font-size:10.5px;color:var(--mute);text-transform:uppercase;letter-spacing:.07em}
@media (max-width:1079px){.wk-content{grid-template-columns:minmax(0,1fr)}.wk-ui{display:none}}
@media (max-width:899px){
  .wk-row{flex-direction:column;height:auto;container-type:normal}
  .wk-panel{flex:none;border-radius:22px}
  .wk-spine{position:relative;inset:auto;flex-direction:row;padding:18px 20px;gap:14px;width:100%;text-align:left}
  .wk-spine-t{writing-mode:horizontal-tb;transform:none;flex:1;font-size:20px;white-space:normal}
  .wk-panel.is-open .wk-spine{opacity:1;pointer-events:auto}
  .wk-panel.is-open .wk-plus{transform:rotate(45deg);background:var(--ink);color:#fff}
  .wk-content{position:relative;width:auto;padding:0 20px 22px;display:none}
  .wk-panel.is-open .wk-content{display:grid}
  .wk-title{display:none}
  .wk-kick{display:none}
  .wk-desc{margin-top:0}
  .wk-feats{grid-template-columns:minmax(0,1fr)}
  .wk-ui{display:flex}
  .wk-ui-in{height:420px;flex:none}
}
${miniCss}
`;

const logoFor = (tech: string) => SKILLS.find((s) => s.name === tech)?.logo;

export default function Work() {
  const [open, setOpenRaw] = useState(0);
  // mini-UIs mount the first time their panel opens (keeps the initial DOM small)
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const setOpen = (i: number) => {
    setOpenRaw(i);
    setSeen((s) => (s.has(i) ? s : new Set(s).add(i)));
  };

  return (
    <section id="work" className="section cv" aria-labelledby="work-title">
      <style>{css}</style>
      <div className="wrap">
        <SectionHead section="work" label="Selected work" title="Things I've" accent="built." id="work-title" />

        <div className="wk-row rv">
          {PROJECTS.map((p, i) => {
            const isOpen = open === i;
            return (
              <article
                key={p.id}
                className={`wk-panel${isOpen ? " is-open" : ""}`}
                onMouseEnter={() => setOpen(i)}
                aria-labelledby={`wk-t-${p.id}`}
              >
                <button
                  className="wk-spine"
                  aria-expanded={isOpen}
                  aria-controls={`wk-c-${p.id}`}
                  onClick={() => setOpen(i)}
                  onFocus={() => setOpen(i)}
                >
                  <span className="wk-spine-n">{p.index}</span>
                  <span className="wk-spine-t" id={`wk-t-${p.id}`}>
                    {p.title}
                  </span>
                  <span className="wk-plus" aria-hidden="true">
                    +
                  </span>
                </button>

                <div id={`wk-c-${p.id}`} className="wk-content" inert={!isOpen}>
                  <div className="wk-text">
                    <p className="wk-kick">
                      <b>{p.index}</b>
                      <span>{p.kicker}</span>
                      <span>· {p.period}</span>
                    </p>
                    <h3 className="wk-title">{p.title}</h3>
                    <p className="wk-desc">{p.description}</p>
                    <ul className="wk-feats">
                      {p.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <ul className="wk-tech" aria-label="Tech stack">
                      {p.tech.map((t) => {
                        const logo = logoFor(t);
                        return (
                          <li key={t} className="chip">
                            {logo && <TechLogo name={logo} size={14} decorative />}
                            {t}
                          </li>
                        );
                      })}
                    </ul>
                    <div className="wk-cta">
                      {p.github && (
                        <a href={p.github} className="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
                          View on GitHub <span aria-hidden="true">↗</span>
                        </a>
                      )}
                      {p.live ? (
                        <a
                          href={p.live}
                          className={`btn btn-sm ${p.github ? "btn-ghost" : "btn-primary"}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View live <span aria-hidden="true">↗</span>
                          <span className="sr-only"> (opens {p.title} in a new tab)</span>
                        </a>
                      ) : (
                        <small>Final year project · no public link</small>
                      )}
                    </div>
                  </div>

                  <figure className="wk-ui">
                    <div className="wk-ui-in" aria-hidden="true">
                      {seen.has(i) && <MiniUI id={p.id} />}
                    </div>
                    <figcaption className="wk-ui-label">Illustrative UI, not a screenshot</figcaption>
                  </figure>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
