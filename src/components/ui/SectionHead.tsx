import { SECTION_INDEX } from "@/lib/data";

interface Props {
  section: string;
  label: string;
  /** heading text before the italic accent */
  title: string;
  /** the one Instrument Serif italic word(s) */
  accent: string;
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

/** "03 — Selected work" tag + bold heading ending in one serif italic word. */
export default function SectionHead({ section, label, title, accent, id, className = "", children }: Props) {
  return (
    <header className={className}>
      <p className="tag rv">
        <span>
          {SECTION_INDEX[section]} — {label}
        </span>
      </p>
      <h2 id={id} className="h-display mt-5">
        <span className="rv-mask">
          <span>{title}</span>
        </span>{" "}
        <span className="rv-mask" style={{ "--i": 1 } as React.CSSProperties}>
          <span>
            <em>{accent}</em>
          </span>
        </span>
      </h2>
      {children}
    </header>
  );
}
