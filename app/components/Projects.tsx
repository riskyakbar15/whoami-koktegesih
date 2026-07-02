import Link from "next/link";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { projects, type Project } from "../data/portfolio";

const severityStyle: Record<Project["severity"], string> = {
  CRITICAL: "text-accent border-accent/40 bg-accent/10",
  HIGH: "text-gold border-gold/40 bg-gold/10",
  MEDIUM: "text-secure border-secure/40 bg-secure/10",
  INFO: "text-muted border-line bg-panel-2",
};

export default function Projects() {
  return (
    <section id="case-files" className="border-t border-line">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <SectionHeading
          file="FILE 04"
          eyebrow="CASE FILES"
          title="Projects & Writeups"
        />
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 80}>
              <article className="group flex h-full flex-col border border-line bg-panel p-6 transition-colors hover:border-accent/50">
                <div className="mb-4 flex items-center justify-between font-mono text-xs">
                  <span className="tracking-widest text-faint">
                    {project.id}
                  </span>
                  <span
                    className={`rounded-sm border px-2 py-0.5 tracking-widest ${severityStyle[project.severity]}`}
                  >
                    {project.severity}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-paper">
                  {project.title}
                </h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-accent">
                  {project.category}
                </p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                  {project.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((tool) => (
                    <span
                      key={tool}
                      className="border border-line px-2 py-0.5 font-mono text-[11px] text-faint"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
                {project.href &&
                  (project.href.startsWith("http") ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-5 inline-flex items-center gap-1 font-mono text-sm text-paper transition-colors group-hover:text-accent"
                    >
                      Open file ↗
                    </a>
                  ) : (
                    <Link
                      href={project.href}
                      className="mt-5 inline-flex items-center gap-1 font-mono text-sm text-paper transition-colors group-hover:text-accent"
                    >
                      Read writeup →
                    </Link>
                  ))}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
