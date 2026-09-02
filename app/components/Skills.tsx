import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { skills } from "../data/portfolio";

// Short-token groups render as tag clouds; the rest as numbered lists.
const TAG_GROUPS = new Set(["TLS", "LNG"]);

export default function Skills() {
  const total = String(skills.length).padStart(2, "0");

  return (
    <section id="capabilities" className="border-t border-line">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <SectionHeading
          file="FILE 03"
          eyebrow="CAPABILITIES"
          title="Capabilities & Tools"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          {skills.map((group, i) => {
            const asTags = TAG_GROUPS.has(group.code);
            const count = String(group.items.length).padStart(2, "0");
            return (
              <Reveal key={group.code} delay={i * 80}>
                <div className="relative h-full border border-line border-l-2 border-l-accent/40 bg-panel p-6 transition-colors hover:border-accent/50 hover:border-l-accent">
                  <span className="pointer-events-none absolute right-4 top-5 font-mono text-[10px] tracking-widest text-faint/70">
                    {String(i + 1).padStart(2, "0")}/{total}
                  </span>
                  <div className="mb-1 flex items-center gap-3 pr-12">
                    <h3 className="font-display text-lg font-semibold text-paper">
                      {group.category}
                    </h3>
                    <span className="font-mono text-xs tracking-widest text-accent">
                      [{group.code}]
                    </span>
                  </div>
                  <p className="mb-3 font-mono text-[10px] tracking-widest text-faint">
                    {`// ${count} ENTRIES`}
                  </p>
                  <div
                    className="mb-5 flex items-center gap-2"
                    role="img"
                    aria-label={`Clearance level ${group.level} of 5`}
                  >
                    <span className="font-mono text-[10px] tracking-widest text-faint">
                      CLEARANCE
                    </span>
                    <span className="flex gap-1" aria-hidden>
                      {Array.from({ length: 5 }).map((_, k) => (
                        <span
                          key={k}
                          className={`h-1.5 w-5 ${
                            k < group.level ? "bg-gold" : "bg-panel-2"
                          }`}
                        />
                      ))}
                    </span>
                  </div>

                  {asTags ? (
                    <ul className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="border border-line bg-panel-2 px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-accent"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-2.5">
                      {group.items.map((item, j) => (
                        <li
                          key={item}
                          className="flex items-baseline gap-3 text-sm text-muted transition-colors hover:text-paper"
                        >
                          <span className="font-mono text-[10px] tracking-widest text-accent">
                            {String(j + 1).padStart(2, "0")}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
