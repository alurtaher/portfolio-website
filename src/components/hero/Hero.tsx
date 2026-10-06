"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";

const css = `
.hero{position:relative;min-height:100svh;padding-top:84px;overflow:clip;isolation:isolate;background:var(--paper)}
.hero-grid{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:end;gap:clamp(12px,2vw,32px);min-height:calc(100svh - 84px)}
.hero-ghost{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);z-index:-1;font-weight:800;font-size:clamp(120px,27vw,480px);letter-spacing:-.06em;line-height:.8;color:transparent;-webkit-text-stroke:1.2px rgba(13,13,13,.13);white-space:nowrap;user-select:none;pointer-events:none;animation:ghostIn 2.2s var(--ease) both .1s}
@keyframes ghostIn{from{opacity:0;letter-spacing:.04em}to{opacity:1;letter-spacing:-.06em}}
.hero-media{position:relative;height:min(96svh,1040px);aspect-ratio:768/960;max-width:56vw;align-self:end;margin-bottom:-2px}
.hero-video{width:100%;height:100%;object-fit:cover;object-position:50% 100%;mix-blend-mode:multiply;animation:heroVid 1.6s var(--ease) both}
@keyframes heroVid{from{opacity:0;transform:translateY(24px) scale(.985)}to{opacity:1;transform:none}}
.hero-left,.hero-right{padding-bottom:clamp(40px,9vh,96px);animation:heroUp 1.2s var(--ease) both}
.hero-right{animation-delay:.15s;justify-self:end;max-width:360px}
@keyframes heroUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
.hero-kicker{font-family:var(--font-mono);font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:var(--mute);display:flex;align-items:center;gap:10px}
.hero-kicker b{position:relative;width:7px;height:7px;border-radius:50%;background:var(--ink)}
.hero-kicker b::after{content:"";position:absolute;inset:0;border-radius:50%;background:var(--ink);animation:dot 2.4s var(--ease) infinite}
@keyframes dot{from{transform:scale(1);opacity:.4}70%,to{transform:scale(3.2);opacity:0}}
.hero-title{margin-top:18px;font-weight:700;letter-spacing:-.045em;line-height:.95;font-size:clamp(44px,5.6vw,96px)}
.hero-title em{display:block;font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-.02em;color:var(--mute)}
.hero-sub{font-size:16px;line-height:1.55;color:var(--ink-2)}
.hero-ctas{margin-top:22px;display:flex;flex-wrap:wrap;gap:10px}
.hero-sound{position:absolute;right:6%;bottom:16%;width:46px;height:46px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;z-index:2;transition:transform .5s var(--ease)}
.hero-sound:hover{transform:scale(1.08)}
.hero-sound svg{width:16px;height:16px}
.hero-sound.is-blocked::before,.hero-sound.is-blocked::after{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 1.5px var(--ink);animation:ping 2s var(--ease) infinite;pointer-events:none}
.hero-sound.is-blocked::after{animation-delay:1s}
@keyframes ping{from{transform:scale(1);opacity:.6}to{transform:scale(1.9);opacity:0}}
.hero-sound-label{position:absolute;right:calc(6% + 56px);bottom:calc(16% + 14px);font-family:var(--font-mono);font-size:11px;color:var(--mute);white-space:nowrap;pointer-events:none;transition:opacity .4s}
@media (max-width:899px){
  .hero{padding-top:76px}
  .hero-grid{grid-template-columns:minmax(0,1fr);justify-items:center;text-align:center;align-items:start;min-height:0;gap:0}
  .hero-media{grid-row:1;height:62svh;max-width:92vw;margin:0}
  .hero-ghost{top:31svh;font-size:34vw}
  .hero-left{grid-row:2;padding-bottom:0;margin-top:-6px}
  .hero-right{grid-row:3;justify-self:center;padding-bottom:56px;padding-top:12px;max-width:520px}
  .hero-kicker{justify-content:center}
  .hero-ctas{justify-content:center}
  .hero-title{font-size:clamp(40px,11vw,64px);margin-top:12px}
  .hero-sound{right:4%;bottom:8%}
  .hero-sound-label{display:none}
}
`;

const Play = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 2.5v11l9.5-5.5z" fill="currentColor" />
  </svg>
);
const Pause = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <rect x="3.5" y="2.5" width="3" height="11" rx=".6" fill="currentColor" />
    <rect x="9.5" y="2.5" width="3" height="11" rx=".6" fill="currentColor" />
  </svg>
);

export default function Hero() {
  preload("/hero/poster.webp", { as: "image", fetchPriority: "high" });
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  /** the visitor explicitly chose "sound off" — never auto-unmute after that */
  const userMuted = useRef(false);
  const visible = useRef(true);
  const reduced = useRef(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    reduced.current = prefersReducedMotion();

    const sync = () => setSoundOn(!v.muted && !v.paused);
    v.addEventListener("volumechange", sync);
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);

    const tryPlay = async () => {
      if (!visible.current) return;
      if (userMuted.current) {
        v.muted = true;
        v.play().catch(() => {});
        return;
      }
      v.muted = false;
      try {
        await v.play();
        setBlocked(false);
      } catch {
        v.muted = true;
        setBlocked(true);
        if (!reduced.current) v.play().catch(() => {});
      }
    };

    // first interaction anywhere unlocks sound (except the sound button itself,
    // which handles its own toggle)
    const unlock = (e: Event) => {
      if (btnRef.current?.contains(e.target as Node)) return;
      off();
      if (!userMuted.current && visible.current) {
        v.muted = false;
        v.play().then(() => setBlocked(false)).catch(() => (v.muted = true));
      }
    };
    const evts = ["pointerdown", "keydown", "touchend"] as const;
    const off = () => evts.forEach((t) => window.removeEventListener(t, unlock, true));
    evts.forEach((t) => window.addEventListener(t, unlock, { capture: true, passive: true }));

    if (!reduced.current) tryPlay();

    // pause (and silence) when less than 35 % of the hero is visible
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.intersectionRatio >= 0.35;
        if (!visible.current) v.pause();
        else if (!reduced.current || !v.muted) v.play().catch(() => {});
      },
      { threshold: [0, 0.35, 0.6] },
    );
    if (sectionRef.current) io.observe(sectionRef.current);

    return () => {
      off();
      io.disconnect();
      v.removeEventListener("volumechange", sync);
      v.removeEventListener("play", sync);
      v.removeEventListener("pause", sync);
    };
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    if (soundOn) {
      userMuted.current = true;
      v.muted = true;
      if (reduced.current) v.pause();
    } else {
      userMuted.current = false;
      v.muted = false;
      v.play().catch(() => {});
    }
    setBlocked(false);
  };

  return (
    <section id="hero" ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <style>{css}</style>
      <div className="wrap hero-grid">
        <span className="hero-ghost" aria-hidden="true">
          {PROFILE.firstName.toUpperCase()}
        </span>

        <div className="hero-left">
          <p className="hero-kicker">
            <b aria-hidden="true" />
            Hi, I&apos;m {PROFILE.firstName} · {PROFILE.location}
          </p>
          <h1 id="hero-title" className="hero-title">
            <span className="sr-only">{PROFILE.name}, </span>
            Full Stack <em>Developer.</em>
          </h1>
        </div>

        <div className="hero-media">
          <video
            ref={videoRef}
            className="hero-video"
            muted
            loop
            playsInline
            preload="auto"
            poster="/hero/poster.webp"
            width={768}
            height={960}
            aria-label={`Intro video: ${PROFILE.name} giving a short self-introduction to camera`}
          >
            <source src="/hero/hero.webm" type="video/webm" />
            <source src="/hero/hero.mp4" type="video/mp4" />
          </video>
          <button
            ref={btnRef}
            className={`hero-sound${blocked ? " is-blocked" : ""}`}
            onClick={toggleSound}
            aria-label={soundOn ? "Mute the intro video" : "Play the intro video with sound"}
            aria-pressed={soundOn}
          >
            {soundOn ? <Pause /> : <Play />}
          </button>
        </div>

        <div className="hero-right">
          <p className="hero-sub">
            {PROFILE.roles.slice(1).join(" · ")}. I build and deploy AI-powered web apps with React.js, Node.js and
            MongoDB.
          </p>
          <div className="hero-ctas">
            <a
              href="#work"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("work");
              }}
            >
              Explore work
            </a>
            <a
              href="#contact"
              className="btn btn-ghost"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("contact");
              }}
            >
              Let&apos;s talk
            </a>
            <a href={PROFILE.resume} className="btn btn-ghost" download>
              Résumé <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
