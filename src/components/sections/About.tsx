import { PROFILE, SECTION_INDEX } from "@/lib/data";
import IdCard from "@/components/ui/IdCard";

const css = `
.about-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(24px,4vw,64px);align-items:stretch}
.about-col{display:flex;flex-direction:column}
.about-hi{font-weight:700;letter-spacing:-.045em;line-height:1;font-size:clamp(40px,4.6vw,72px)}
.about-summary{margin-top:28px}
.about-line{margin-top:16px;color:var(--mute);font-size:15px;line-height:1.6}
.about-btns{margin-top:auto;padding-top:32px;display:flex;flex-wrap:wrap;gap:10px}
.facts{list-style:none;margin:28px 0 0;padding:0;border-top:1px solid var(--line)}
.fact{display:grid;grid-template-columns:96px minmax(0,1fr);gap:16px;padding:16px 0;border-bottom:1px solid var(--line);font-size:15px;line-height:1.45}
.fact dt{font-family:var(--font-mono);font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--mute);padding-top:3px}
.fact dd{overflow-wrap:anywhere}
.fact a{background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat;transition:background-size .5s var(--ease)}
.fact a:hover{background-size:100% 1px}
.about-quote{margin-top:auto;padding-top:36px;font-family:var(--font-serif);font-style:italic;font-size:clamp(24px,2.1vw,32px);line-height:1.15;letter-spacing:-.01em;color:var(--ink)}
.about-quote::before{content:"“";display:block;font-size:2.2em;line-height:.6;color:var(--faint)}
@media (max-width:1079px){
  .about-grid{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
  .about-card{grid-column:1/-1;grid-row:1;margin-bottom:40px}
}
@media (max-width:699px){
  .about-grid{grid-template-columns:minmax(0,1fr)}
  .about-quote{padding-top:28px}
}
`;

export default function About() {
  const facts = [
    { k: "Location", v: PROFILE.location },
    { k: "Education", v: `M.Tech CSE · ${PROFILE.cgpa} CGPA` },
    { k: "Now", v: PROFILE.currentRole },
    { k: "Email", v: PROFILE.email, href: `mailto:${PROFILE.email}` },
  ];

  return (
    <section id="about" className="section cv" aria-labelledby="about-title">
      <style>{css}</style>
      <div className="wrap about-grid">
        <div className="about-col">
          <p className="tag rv">
            <span>{SECTION_INDEX.about} — About</span>
          </p>
          <h2 id="about-title" className="about-hi mt-5">
            <span className="rv-mask">
              <span>Hi, I&apos;m</span>
            </span>
            <span className="rv-mask" style={{ "--i": 1 } as React.CSSProperties}>
              <span>
                <em className="serif-accent">{PROFILE.firstName}.</em>
              </span>
            </span>
          </h2>
          <p className="lede about-summary rv" style={{ "--i": 1 } as React.CSSProperties}>
            {PROFILE.resumeSummary}
          </p>
          <p className="about-line rv" style={{ "--i": 2 } as React.CSSProperties}>
            {PROFILE.aboutLine}
          </p>
          <div className="about-btns rv" style={{ "--i": 3 } as React.CSSProperties}>
            <a href={PROFILE.resume} className="btn btn-primary btn-sm" download>
              Résumé <span aria-hidden="true">↓</span>
            </a>
            <a href={PROFILE.github} className="btn btn-ghost btn-sm" target="_blank" rel="noopener noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a href={PROFILE.linkedin} className="btn btn-ghost btn-sm" target="_blank" rel="noopener noreferrer">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="about-card">
          <IdCard />
        </div>

        <div className="about-col">
          <h3 className="tag rv">
            <span>Quick facts</span>
          </h3>
          <dl className="facts">
            {facts.map((f, i) => (
              <div key={f.k} className="fact rv" style={{ "--i": i } as React.CSSProperties}>
                <dt>{f.k}</dt>
                <dd>{f.href ? <a href={f.href}>{f.v}</a> : f.v}</dd>
              </div>
            ))}
          </dl>
          <blockquote className="about-quote rv">{PROFILE.quote}</blockquote>
        </div>
      </div>
    </section>
  );
}
