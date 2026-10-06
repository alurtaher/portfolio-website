/**
 * Illustrative, grayscale mini-UIs: hints at what each product does.
 * Not screenshots, and deliberately free of invented numbers.
 */

export const miniCss = `
.mui{position:relative;width:100%;height:100%;border-radius:20px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;padding:18px;display:flex;flex-direction:column;gap:12px;font-size:12px;color:var(--ink-2)}
.mui-bar{display:flex;align-items:center;gap:6px}
.mui-bar i{width:8px;height:8px;border-radius:50%;background:var(--faint);opacity:.6}
.mui-bar span{margin-left:8px;font-family:var(--font-mono);font-size:10.5px;color:var(--mute)}
.mui-card{background:var(--card);border-radius:14px;box-shadow:inset 0 0 0 1px var(--line);padding:12px}
.mui-k{font-family:var(--font-mono);font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--mute)}
.mui-sk{height:7px;border-radius:4px;background:var(--soft)}
.mui-wave{display:flex;align-items:center;justify-content:center;gap:3px;height:54px}
.mui-wave i{width:4px;height:var(--wh);border-radius:3px;background:var(--ink);transform:scaleY(.2);animation:wave 1.2s var(--ease) infinite alternate;animation-delay:calc(var(--j) * -90ms)}
@keyframes wave{to{transform:scaleY(1)}}
.wk-panel:not(.is-open) .mui-wave i,.wk-panel:not(.is-open) .mui-dot{animation-play-state:paused}
.mui-msg{max-width:78%;padding:9px 11px;border-radius:12px;line-height:1.35}
.mui-msg.ai{background:var(--card);box-shadow:inset 0 0 0 1px var(--line)}
.mui-msg.me{margin-left:auto;background:var(--ink);color:#fff}
.mui-crit{display:grid;grid-template-columns:110px minmax(0,1fr);gap:6px 10px;align-items:center}
.mui-crit b{font-weight:500;font-size:11px}
.mui-crit .mui-sk{position:relative;overflow:hidden}
.mui-crit .mui-sk::after{content:"";position:absolute;inset:0;width:var(--w);background:var(--ink-2);border-radius:4px;transform-origin:0;animation:fill 1.6s var(--ease) both .5s}
@keyframes fill{from{transform:scaleX(0)}}
.mui-drop{border:1.5px dashed rgba(13,13,13,.2);border-radius:14px;padding:14px;display:flex;align-items:center;gap:12px}
.mui-file{width:30px;height:38px;border-radius:5px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);position:relative}
.mui-file::after{content:"";position:absolute;right:0;top:0;border:6px solid transparent;border-right-color:var(--paper);border-top-color:var(--paper)}
.mui-ring{width:74px;height:74px;border-radius:50%;background:conic-gradient(var(--ink) 0 var(--p),var(--soft) var(--p) 100%);display:grid;place-items:center;flex:none}
.mui-ring::after{content:"";width:58px;height:58px;border-radius:50%;background:var(--card)}
.mui-chips{display:flex;flex-wrap:wrap;gap:5px}
.mui-chips span{padding:4px 8px;border-radius:999px;font-size:10.5px;box-shadow:inset 0 0 0 1px var(--line);background:var(--card)}
.mui-chips span.off{background:transparent;border:1px dashed rgba(13,13,13,.25);box-shadow:none;color:var(--mute)}
.mui-pipe{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;position:relative}
.mui-pipe div{background:var(--card);box-shadow:inset 0 0 0 1px var(--line);border-radius:10px;padding:10px 6px;text-align:center;font-size:10.5px;font-weight:500}
.mui-pipe div:nth-child(odd){background:var(--ink);color:#fff;box-shadow:none}
.mui-dot{position:absolute;top:-6px;left:0;width:8px;height:8px;border-radius:50%;background:var(--ink);animation:travel 3.2s var(--ease) infinite}
@keyframes travel{0%{left:2%}100%{left:96%}}
.mui-vec{display:grid;grid-template-columns:repeat(12,1fr);gap:4px}
.mui-vec i{aspect-ratio:1;border-radius:3px;background:var(--ink);opacity:var(--o)}
.mui-src{display:flex;gap:6px;margin-top:8px}
.mui-src span{font-family:var(--font-mono);font-size:9.5px;padding:3px 7px;border-radius:6px;background:var(--soft)}
`;

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mui">
      <div className="mui-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Roleplay() {
  const crit = ["Tone", "Objection handling", "Empathy", "Closure rate"];
  const widths = ["72%", "58%", "84%", "64%"];
  return (
    <Frame title="voice session">
      <div className="mui-card">
        <p className="mui-k">AI customer · speaking</p>
        <div className="mui-wave">
          {Array.from({ length: 28 }, (_, j) => (
            <i key={j} style={{ "--j": j, "--wh": `${12 + ((j * 37) % 40)}px` } as React.CSSProperties} />
          ))}
        </div>
      </div>
      <div className="mui-msg ai">
        <div className="mui-sk" style={{ width: "90%" }} />
        <div className="mui-sk" style={{ width: "60%", marginTop: 6 }} />
      </div>
      <div className="mui-msg me">Speech → text → reply (TTS)</div>
      <div className="mui-card" style={{ marginTop: "auto" }}>
        <p className="mui-k" style={{ marginBottom: 10 }}>
          Claude API scoring
        </p>
        <div className="mui-crit">
          {crit.map((c, i) => (
            <div key={c} style={{ display: "contents" }}>
              <b>{c}</b>
              <div className="mui-sk" style={{ "--w": widths[i] } as React.CSSProperties} />
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function CareerPilot() {
  return (
    <Frame title="careerpilot">
      <div className="mui-drop">
        <div className="mui-file" />
        <div style={{ flex: 1 }}>
          <b style={{ fontWeight: 500 }}>Upload resume</b>
          <p className="mui-k" style={{ marginTop: 3 }}>
            PDF / DOCX
          </p>
        </div>
      </div>
      <div className="mui-card" style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div className="mui-ring" style={{ "--p": "68%" } as React.CSSProperties} />
        <div style={{ flex: 1 }}>
          <p className="mui-k">Match score vs. job description</p>
          <div className="mui-sk" style={{ width: "86%", marginTop: 8 }} />
          <div className="mui-sk" style={{ width: "54%", marginTop: 6 }} />
        </div>
      </div>
      <div className="mui-card">
        <p className="mui-k" style={{ marginBottom: 8 }}>
          Skill gap analysis
        </p>
        <div className="mui-chips">
          <span>React.js</span>
          <span>Node.js</span>
          <span>MongoDB</span>
          <span className="off">gap</span>
          <span className="off">gap</span>
        </div>
      </div>
      <div className="mui-card" style={{ marginTop: "auto" }}>
        <p className="mui-k" style={{ marginBottom: 8 }}>
          Interview plan · PDF roadmap
        </p>
        {[80, 66, 74].map((w) => (
          <div key={w} style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, boxShadow: "inset 0 0 0 1.5px var(--ink)" }} />
            <div className="mui-sk" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Rag() {
  return (
    <Frame title="rag-medical-assistant">
      <div className="mui-pipe" style={{ marginTop: 6 }}>
        <span className="mui-dot" aria-hidden="true" />
        <div>Ingest</div>
        <div>Embed</div>
        <div>Retrieve</div>
        <div>Generate</div>
      </div>
      <div className="mui-card">
        <p className="mui-k" style={{ marginBottom: 8 }}>
          FAISS index
        </p>
        <div className="mui-vec">
          {Array.from({ length: 36 }, (_, j) => (
            <i key={j} style={{ "--o": (0.08 + ((j * 53) % 90) / 100).toFixed(2) } as React.CSSProperties} />
          ))}
        </div>
      </div>
      <div className="mui-msg me" style={{ marginTop: "auto" }}>
        Medical question
      </div>
      <div className="mui-msg ai" style={{ maxWidth: "88%" }}>
        <div className="mui-sk" style={{ width: "94%" }} />
        <div className="mui-sk" style={{ width: "80%", marginTop: 6 }} />
        <div className="mui-sk" style={{ width: "46%", marginTop: 6 }} />
        <div className="mui-src">
          <span>chunk</span>
          <span>chunk</span>
          <span>chunk</span>
        </div>
      </div>
    </Frame>
  );
}

const MAP: Record<string, () => React.JSX.Element> = { roleplay: Roleplay, careerpilot: CareerPilot, rag: Rag };

export default function MiniUI({ id }: { id: string }) {
  const C = MAP[id];
  return C ? <C /> : null;
}
