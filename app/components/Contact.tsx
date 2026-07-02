import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import Redacted from "./Redacted";
import SocialIcon from "./SocialIcon";
import { socials, profile } from "../data/portfolio";

export default function Contact() {
  return (
    <section id="contact" className="border-t border-line">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <SectionHeading
          file="FILE 07"
          eyebrow="SECURE CHANNEL"
          title="Contact"
        />
        <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
          <Reveal>
            <p className="text-lg leading-relaxed text-muted">
              Open to collaboration, internships, and security discussions.
              Contact channels are listed below —{" "}
              <Redacted>declassified</Redacted> and ready.
            </p>
            <p className="mt-6 font-mono text-sm text-faint">
              {profile.codename} · {profile.uid}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <ul className="divide-y divide-line border border-line bg-panel">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      s.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-panel-2"
                  >
                    <span className="flex shrink-0 items-center gap-3 font-mono text-xs uppercase tracking-widest text-faint transition-colors group-hover:text-accent">
                      <SocialIcon name={s.icon} />
                      <span className="hidden md:inline">{s.label}</span>
                    </span>
                    <span className="min-w-0 truncate font-mono text-sm text-paper transition-colors group-hover:text-accent">
                      {s.value} →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
