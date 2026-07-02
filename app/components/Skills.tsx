import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { skills } from "../data/portfolio";

export default function Skills() {
  return (
    <section id="capabilities" className="border-t border-line">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <SectionHeading
          file="FILE 03"
          eyebrow="CAPABILITIES"
          title="Capabilities & Tools"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          {skills.map((group, i) => (
            <Reveal key={group.code} delay={i * 80}>
              <div className="h-full border border-line bg-panel p-6 transition-colors hover:border-accent/50">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-paper">
                    {group.category}
                  </h3>
                  <span className="font-mono text-xs tracking-widest text-accent">
                    [{group.code}]
                  </span>
                </div>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-muted"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
