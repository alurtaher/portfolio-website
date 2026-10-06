import { CERTIFICATIONS, SECTION_INDEX } from "@/lib/data";

/**
 * Ink-flood index. The résumé lists no certifications, so this renders nothing
 * until CERTIFICATIONS in data.ts is filled (then add { id: "certifications" } to NAV).
 */
const css = `
.cert{background:var(--card);border-block:1px solid var(--line)}
.cert-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(32px,6vw,96px);align-items:start}
.cert-side{position:sticky;top:120px}
.cert-count{margin-top:20px;font-family:var(--font-mono);font-size:12px;color:var(--mute)}
.cert-list{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
.cert-row{position:relative;display:grid;grid-template-columns:48px minmax(0,1fr) 24px;gap:16px;align-items:center;padding:22px 16px;border-bottom:1px solid var(--line);isolation:isolate;transition:color .5s var(--ease)}
.cert-row::before{content:"";position:absolute;inset:0;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .7s var(--ease);z-index:-1}
.cert-row:hover,.cert-row:focus-visible{color:#fff}
.cert-row:hover::before,.cert-row:focus-visible::before{transform:scaleX(1)}
.cert-n{font-family:var(--font-mono);font-size:12px;opacity:.6}
.cert-t{font-weight:600;font-size:clamp(17px,1.6vw,22px);letter-spacing:-.02em}
.cert-i{display:block;font-size:13px;opacity:.6;margin-top:3px;font-weight:400}
.cert-arrow{opacity:0;transform:translateX(-10px);transition:opacity .5s var(--ease),transform .6s var(--ease)}
.cert-row:hover .cert-arrow,.cert-row:focus-visible .cert-arrow{opacity:1;transform:none}
`;

export default function Certifications() {
  const index = SECTION_INDEX.certifications ?? "";
  if (!CERTIFICATIONS.length) return null;
  return (
    <section id="certifications" className="section cert" aria-labelledby="cert-title">
      <style>{css}</style>
      <div className="wrap cert-grid">
        <div className="cert-side">
          <p className="tag rv">
            <span>{index} — Certifications</span>
          </p>
          <h2 id="cert-title" className="h-display mt-5">
            Always <em>learning.</em>
          </h2>
          <p className="cert-count">{String(CERTIFICATIONS.length).padStart(2, "0")} certifications</p>
        </div>
        <ol className="cert-list">
          {CERTIFICATIONS.map((c, i) => {
            const inner = (
              <>
                <span className="cert-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="cert-t">
                  {c.title}
                  <span className="cert-i">{c.issuer}</span>
                </span>
                <span className="cert-arrow" aria-hidden="true">
                  ↗
                </span>
              </>
            );
            return (
              <li key={c.title}>
                {c.href ? (
                  <a className="cert-row" href={c.href} target="_blank" rel="noopener noreferrer">
                    {inner}
                  </a>
                ) : (
                  <div className="cert-row" tabIndex={0}>
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
