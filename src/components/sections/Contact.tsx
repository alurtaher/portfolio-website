"use client";

import { useRef, useState } from "react";
import { PROFILE, SECTION_INDEX } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

const css = `
.ct{padding-bottom:0}
.ct-title{margin-top:24px;font-weight:700;letter-spacing:-.05em;line-height:.95;font-size:clamp(46px,9.2vw,150px)}
.ct-line{display:block}
.ct-title .rv-mask{padding-top:.2em;margin-top:-.2em}
.ct-word{display:inline-block;white-space:nowrap}
.ct-l{display:inline-block;will-change:transform}
.ct-l.hop{animation:hop .7s var(--ease)}
@keyframes hop{0%{transform:translateY(0)}30%{transform:translateY(-.16em)}55%{transform:translateY(.02em)}75%{transform:translateY(-.04em)}100%{transform:translateY(0)}}
.ct-title .ct-accent{font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-.02em;color:var(--mute)}
.ct-grid{margin-top:clamp(48px,8vh,88px);display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px;align-items:end;padding-bottom:clamp(56px,10vh,110px);border-bottom:1px solid var(--line)}
.ct-mail-row{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.ct-mail{font-weight:600;letter-spacing:-.035em;font-size:clamp(22px,3.6vw,52px);line-height:1.1;overflow-wrap:anywhere;background:linear-gradient(currentColor,currentColor) 0 100%/100% 2px no-repeat;padding-bottom:4px;transition:background-size .6s var(--ease)}
.ct-mail:hover{background-size:0 2px;background-position:100% 100%}
.ct-copy{height:36px;padding:0 14px;border-radius:999px;font-family:var(--font-mono);font-size:12px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.18);transition:background-color .4s var(--ease),color .4s var(--ease)}
.ct-copy:hover,.ct-copy.is-done{background:var(--ink);color:#fff}
.ct-links{margin-top:28px;display:flex;flex-wrap:wrap;gap:10px}
.ct-badge{position:relative;width:150px;height:150px;flex:none}
.ct-badge svg{width:100%;height:100%;animation:spin 18s linear infinite}
.ct-badge text{font-family:var(--font-mono);font-size:10.4px;letter-spacing:.32em;text-transform:uppercase;fill:var(--ink)}
.ct-badge-btn{position:absolute;inset:50px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:20px;transition:transform .6s var(--ease)}
.ct-badge:hover .ct-badge-btn,.ct-badge-btn:focus-visible{transform:scale(1.12) rotate(-45deg)}
@keyframes spin{to{transform:rotate(360deg)}}
.ft{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;padding-block:28px 36px;font-size:13.5px;color:var(--mute)}
.ft a{color:var(--ink)}
.ft a:hover{text-decoration:underline;text-underline-offset:3px}
@media (max-width:699px){.ct-grid{grid-template-columns:minmax(0,1fr)}.ct-badge{width:120px;height:120px}.ct-badge-btn{inset:40px}}
`;

const LINES: { text: string; accent?: boolean }[][] = [
  [{ text: "Let's" }, { text: "build" }],
  [{ text: "something" }, { text: "together.", accent: true }],
];

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      // fallback for non-secure contexts
      const ta = document.createElement("textarea");
      ta.value = PROFILE.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  const hop = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    if (!t.classList.contains("ct-l") || t.classList.contains("hop")) return;
    t.classList.add("hop");
    t.addEventListener("animationend", () => t.classList.remove("hop"), { once: true });
  };

  return (
    <section id="contact" className="section ct cv" aria-labelledby="contact-title">
      <style>{css}</style>
      <div className="wrap">
        <p className="tag rv">
          <span>{SECTION_INDEX.contact} — Contact</span>
        </p>
        <h2 id="contact-title" className="ct-title" aria-label="Let's build something together." onMouseOver={hop}>
          {LINES.map((line, li) => (
            <span key={li} className="rv-mask ct-line" style={{ "--i": li } as React.CSSProperties} aria-hidden="true">
              <span>
                {line.map((w, wi) => (
                  <span key={wi}>
                    <span className={`ct-word${w.accent ? " ct-accent" : ""}`}>
                      {Array.from(w.text).map((ch, ci) => (
                        <span key={ci} className="ct-l">
                          {ch}
                        </span>
                      ))}
                    </span>
                    {wi < line.length - 1 ? " " : ""}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h2>

        <div className="ct-grid">
          <div>
            <div className="ct-mail-row rv">
              <a className="ct-mail" href={`mailto:${PROFILE.email}`}>
                {PROFILE.email}
              </a>
              <button className={`ct-copy${copied ? " is-done" : ""}`} onClick={copy} aria-label="Copy email address">
                {copied ? "Copied ✓" : "Copy"}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>
            <div className="ct-links rv" style={{ "--i": 1 } as React.CSSProperties}>
              <a href={PROFILE.phoneHref} className="btn btn-ghost btn-sm">
                {PROFILE.phone}
              </a>
              <a href={PROFILE.github} className="btn btn-ghost btn-sm" target="_blank" rel="noopener noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
              <a href={PROFILE.linkedin} className="btn btn-ghost btn-sm" target="_blank" rel="noopener noreferrer">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a href={PROFILE.leetcode} className="btn btn-ghost btn-sm" target="_blank" rel="noopener noreferrer">
                LeetCode <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="ct-badge">
            <svg viewBox="0 0 150 150" aria-hidden="true">
              <defs>
                <path id="ct-circle" d="M75,75 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0" />
              </defs>
              <text>
                <textPath href="#ct-circle" textLength="362" lengthAdjust="spacing">
                  say hello · say hello · say hello ·
                </textPath>
              </text>
            </svg>
            <a href={`mailto:${PROFILE.email}`} className="ct-badge-btn" aria-label="Say hello by email">
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="wrap ft">
      <span>
        © {new Date().getFullYear()} {PROFILE.name}
      </span>
      <span>Built with Next.js</span>
      <a
        href="#hero"
        onClick={(e) => {
          e.preventDefault();
          scrollToTarget("hero");
        }}
      >
        Back to top <span aria-hidden="true">↑</span>
      </a>
    </footer>
  );
}
