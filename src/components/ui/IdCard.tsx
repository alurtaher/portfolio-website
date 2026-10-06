"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE, PROJECTS } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

const css = `
.idc{position:relative;height:100%;display:flex;justify-content:center;min-height:620px}
.idc-swing{position:absolute;top:calc(var(--section-y) * -1);left:50%;width:300px;margin-left:-150px;display:flex;flex-direction:column;align-items:center;transform-origin:50% 0;transform:rotate(var(--a,0deg));will-change:transform}
.idc-strap{position:relative;width:30px;height:calc(var(--section-y) + 56px);background:var(--ink);overflow:hidden;border-radius:0 0 4px 4px;box-shadow:inset 2px 0 0 rgba(255,255,255,.07),inset -2px 0 0 rgba(255,255,255,.07)}
.idc-strap::before,.idc-strap::after{content:"";position:absolute;top:0;bottom:0;width:1px;background:repeating-linear-gradient(to bottom,rgba(255,255,255,.35) 0 3px,transparent 3px 7px)}
.idc-strap::before{left:4px}.idc-strap::after{right:4px}
.idc-strap-text{position:absolute;left:50%;top:0;writing-mode:vertical-rl;transform:translateX(-50%);font-family:var(--font-mono);font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.8);white-space:nowrap;animation:strap 14s linear infinite}
@keyframes strap{from{transform:translate(-50%,0)}to{transform:translate(-50%,-50%)}}
.idc-clip{position:relative;width:26px;height:34px;margin-top:-2px;z-index:1}
.idc-clip i{position:absolute;left:3px;right:3px;top:0;height:14px;border-radius:3px;background:linear-gradient(180deg,#e9e9e9,#9a9a9a 55%,#d6d6d6);box-shadow:inset 0 0 0 1px rgba(0,0,0,.25)}
.idc-clip b{position:absolute;left:50%;top:10px;width:18px;height:24px;margin-left:-9px;border:3px solid #a3a3a3;border-radius:9px 9px 6px 6px;border-top-color:#d9d9d9}
.idc-card{position:relative;width:300px;height:404px;margin-top:-6px;perspective:1400px;cursor:pointer;border-radius:22px;-webkit-tap-highlight-color:transparent}
.idc-inner{position:absolute;inset:0;transform-style:preserve-3d;transition:transform 1s var(--ease)}
.idc-btn{position:absolute;inset:0;z-index:5;border-radius:22px;cursor:pointer;-webkit-tap-highlight-color:transparent}
.idc-btn:focus-visible{outline:2px solid var(--ink);outline-offset:4px}
.idc-card.is-flipped .idc-inner{transform:rotateY(180deg)}
@media (hover:hover) and (pointer:fine){.idc-card:hover .idc-inner{transform:rotateY(180deg)}.idc-card.is-flipped:hover .idc-inner{transform:rotateY(180deg)}}
.idc-face{position:absolute;inset:0;border-radius:22px;background:var(--card);backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden;box-shadow:inset 0 0 0 1px var(--line),0 40px 80px -40px rgba(13,13,13,.45),0 18px 30px -20px rgba(13,13,13,.25)}
.idc-face::before{content:"";position:absolute;left:50%;top:10px;width:46px;height:8px;margin-left:-23px;border-radius:6px;background:var(--paper);box-shadow:inset 0 1px 2px rgba(0,0,0,.25);z-index:3}
.idc-back{transform:rotateY(180deg)}
.idc-band{height:52px;background:var(--ink);color:#fff;display:flex;align-items:flex-end;justify-content:space-between;padding:0 18px 10px;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.2em}
.idc-band span:last-child{color:rgba(255,255,255,.55);letter-spacing:.08em}
.idc-photo{position:relative;width:128px;height:156px;margin:14px auto 0;border-radius:16px;padding:3px;background:linear-gradient(145deg,#d9d7d2,#8f8d88 50%,#e6e4df)}
.idc-photo::before{content:"";position:absolute;inset:-18px;border-radius:30px;background:radial-gradient(closest-side,rgba(13,13,13,.10),transparent);z-index:-1}
.idc-photo-in{width:100%;height:100%;border-radius:13px;overflow:hidden;background:#fff}
.idc-photo img{width:100%;height:100%;object-fit:cover;object-position:50% 0%;transform:scale(1.02);transform-origin:50% 0;transition:transform .9s var(--ease)}
.idc-card:hover .idc-photo img{transform:scale(1.12)}
.idc-name{margin-top:10px;text-align:center;font-weight:700;letter-spacing:-.03em;font-size:19px;line-height:1.1}
.idc-role{text-align:center;font-size:12.5px;color:var(--mute);margin-top:3px}
.idc-rows{margin:10px 18px 0;display:grid;gap:3px}
.idc-row{display:flex;justify-content:space-between;font-size:11.5px;border-top:1px dashed var(--line);padding-top:4px}
.idc-row dt{font-family:var(--font-mono);color:var(--faint);font-size:10px;letter-spacing:.06em;text-transform:uppercase}
.idc-row dd{font-weight:500}
.idc-foot{position:absolute;left:18px;right:18px;bottom:12px;display:flex;align-items:flex-end;justify-content:space-between}
.idc-bar{display:block;width:118px;height:24px;background-repeat:no-repeat}
.idc-holo{width:28px;height:28px;border-radius:50%;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12);position:relative}
.idc-holo::before{content:"";position:absolute;inset:0;background:conic-gradient(#f2f2f2,#a8a8a8,#ffffff,#8c8c8c,#e0e0e0,#b5b5b5,#f2f2f2);animation:holo 6s linear infinite}
.idc-holo::after{content:"";position:absolute;inset:6px;border-radius:50%;border:1px solid rgba(255,255,255,.8)}
@keyframes holo{to{transform:rotate(360deg)}}
.idc-back-body{padding:34px 22px 0}
.idc-back h3{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--mute)}
.idc-back ul{list-style:none;padding:0;margin:14px 0 0;display:grid;gap:9px}
.idc-back li{font-size:13px;line-height:1.4;padding-left:16px;position:relative;color:var(--ink-2)}
.idc-back li::before{content:"";position:absolute;left:0;top:.55em;width:7px;height:1.5px;background:var(--ink)}
.idc-sign{position:absolute;left:22px;right:22px;bottom:46px}
.idc-sign span{display:block;font-family:var(--font-serif);font-style:italic;font-size:26px;line-height:1;transform:rotate(-4deg);transform-origin:0 100%}
.idc-sign i{display:block;height:1px;background:var(--ink);margin-top:4px}
.idc-sign small{font-family:var(--font-mono);font-size:9.5px;color:var(--faint);letter-spacing:.06em}
.idc-found{position:absolute;left:0;right:0;bottom:0;height:34px;background:var(--soft);display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--ink-2);padding:0 10px;text-align:center}
.idc-hint{position:absolute;bottom:-34px;left:0;right:0;text-align:center;font-family:var(--font-mono);font-size:11px;color:var(--mute)}
@media (max-width:1079px){.idc{min-height:600px}.idc-swing{top:calc(var(--section-y) * -.4)}.idc-strap{height:calc(var(--section-y) * .4 + 56px)}}
`;

/** Deterministic barcode from the name, as one hard-stop gradient (bars 1–3 px). */
function bars(seed: string) {
  const stops: string[] = [];
  let x = 0;
  for (let i = 0; i < 38; i++) {
    const w = ((seed.charCodeAt(i % seed.length) * (i + 7)) % 3) + 1;
    const c = i % 5 === 0 ? "transparent" : "#0d0d0d";
    stops.push(`${c} ${x}px ${x + w}px`, `transparent ${x + w}px ${x + w + 1}px`);
    x += w + 1;
  }
  return `linear-gradient(90deg, ${stops.join(", ")}, transparent ${x}px)`;
}

export default function IdCard() {
  const swingRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  // damped pendulum: pointer velocity → angular impulse, spring back, idle sway
  useEffect(() => {
    const el = swingRef.current;
    const host = el?.closest("section");
    if (!el || !host || prefersReducedMotion()) return;
    let a = 0;
    let w = 0;
    let raf = 0;
    let last = performance.now();
    let lastInput = 0;
    let lastX = 0;
    let lastT = 0;
    let running = false;

    const K = 26; // stiffness (1/s²)
    const C = 2.4; // damping (1/s)
    const tick = (t: number) => {
      const dt = Math.min(0.033, (t - last) / 1000);
      last = t;
      const idle = t - lastInput > 1400;
      const target = idle ? Math.sin(t / 1100) * 1.6 : 0;
      w += (-K * (a - target) - C * w) * dt;
      a += w * dt;
      a = Math.max(-22, Math.min(22, a));
      el.style.setProperty("--a", `${a.toFixed(3)}deg`);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (lastT && now - lastT < 100) {
        const vx = (e.clientX - lastX) / Math.max(1, now - lastT); // px/ms
        // stronger push the closer the pointer is to the card
        const r = el.getBoundingClientRect();
        const dist = Math.abs(e.clientX - (r.left + r.width / 2));
        const near = Math.max(0.25, 1 - dist / 700);
        w += vx * 9 * near;
      }
      lastX = e.clientX;
      lastT = now;
      lastInput = now;
    };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(host);
    host.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      stop();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
    };
  }, []);

  const toggle = () => setFlipped((f) => !f);
  const b = bars(PROFILE.name);

  return (
    <div className="idc">
      <style>{css}</style>
      <div ref={swingRef} className="idc-swing">
        <div className="idc-strap" aria-hidden="true">
          <span className="idc-strap-text">
            {Array.from({ length: 6 }, () => `${PROFILE.name} · ${PROFILE.role} · `).join("")}
          </span>
        </div>
        <div className="idc-clip" aria-hidden="true">
          <i />
          <b />
        </div>
        <div className={`idc-card${flipped ? " is-flipped" : ""}`}>
          {/* transparent overlay button: Enter/Space flip, touch/pen flip on tap, mouse flips on hover */}
          <button
            type="button"
            className="idc-btn"
            aria-pressed={flipped}
            aria-label={`Flip the developer ID card of ${PROFILE.name}`}
            onPointerUp={(e) => {
              if (e.pointerType !== "mouse") toggle();
            }}
            onClick={(e) => {
              if (e.detail === 0) toggle(); // keyboard activation
            }}
          />
          <div className="idc-inner">
            {/* front */}
            <div className="idc-face idc-front">
              <div className="idc-band">
                <span>DEVELOPER ID</span>
                <span>{PROFILE.initials}·{PROFILE.graduation.slice(2)}</span>
              </div>
              <div className="idc-photo">
                <div className="idc-photo-in">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/portrait-bust.webp"
                    width={480}
                    height={600}
                    alt={`Portrait of ${PROFILE.name}`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              <p className="idc-name">{PROFILE.name}</p>
              <p className="idc-role">{PROFILE.role}</p>
              <dl className="idc-rows">
                <div className="idc-row">
                  <dt>ID No.</dt>
                  <dd>
                    {PROFILE.initials}-CSE-{PROFILE.graduation}
                  </dd>
                </div>
                <div className="idc-row">
                  <dt>Dept.</dt>
                  <dd>Computer Science &amp; Engg.</dd>
                </div>
                <div className="idc-row">
                  <dt>Valid till</dt>
                  <dd>{PROFILE.graduation}</dd>
                </div>
              </dl>
              <div className="idc-foot" aria-hidden="true">
                <span className="idc-bar" style={{ backgroundImage: b }} />
                <span className="idc-holo" />
              </div>
            </div>

            {/* back */}
            <div className="idc-face idc-back">
              <div className="idc-back-body">
                <h3>What I am</h3>
                <ul>
                  <li>{PROFILE.roles.join(" · ")}</li>
                  <li>M.Tech CSE · CGPA {PROFILE.cgpa}</li>
                  <li>200+ problems solved on LeetCode</li>
                  <li>Built {PROJECTS.map((p) => p.title).join(", ")}</li>
                  <li>Mentored 200+ students · 100+ mock interviews</li>
                </ul>
              </div>
              <div className="idc-sign">
                <span aria-hidden="true">{PROFILE.name}</span>
                <i />
                <small>SIGNATURE</small>
              </div>
              <p className="idc-found">If found, say hello · {PROFILE.email}</p>
            </div>
          </div>
          <span className="idc-hint" aria-hidden="true">
            hover · tap · enter to flip
          </span>
        </div>
      </div>
    </div>
  );
}
