import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { timeline } from "../data/portfolio";

export default function Timeline() {
  return (
    <section id="track-record" className="border-t border-line">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <SectionHeading
          file="FILE 06"
          eyebrow="SERVICE RECORD"
          title="Experience & Education"
        />
        <ol className="relative ml-3 border-l border-line">
          {timeline.map((entry, i) => (
            <li key={entry.title} className="relative pb-10 pl-8 last:pb-0">
              <Reveal delay={i * 80}>
                <span className="absolute -left-1.75 top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-ink" />
                <p className="font-mono text-xs tracking-widest text-accent">
                  {entry.period}
                </p>
                <h3 className="mt-1 font-display text-lg font-medium text-paper">
                  {entry.title}
                </h3>
                <p className="font-mono text-xs text-faint">{entry.org}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {entry.detail}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
