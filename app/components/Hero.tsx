import Image from "next/image";
import Redacted from "./Redacted";
import { profile } from "../data/portfolio";

export default function Hero() {
  return (
    <section id="subject" className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_256px]">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 border border-line bg-panel px-3 py-1 font-mono text-xs tracking-widest text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            FILE OPEN — ACCESS GRANTED
          </p>

          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-paper sm:text-7xl">
            <Redacted>{profile.name}</Redacted>
          </h1>
          <p className="mt-4 font-mono text-sm tracking-widest text-accent">
            CYBER SECURITY · NETWORKING · RED TEAM
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 font-mono text-sm sm:max-w-2xl sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-widest text-faint">
                Subject Code
              </dt>
              <dd className="mt-1 text-paper">{profile.codename}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-faint">
                Role
              </dt>
              <dd className="mt-1 text-paper">Informatics Student</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-faint">
                Location
              </dt>
              <dd className="mt-1 text-paper">{profile.location}</dd>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <dt className="text-xs uppercase tracking-widest text-faint">
                Classified Summary
              </dt>
              <dd className="mt-1 leading-relaxed text-paper">
                &ldquo;If you know the enemy and know yourself, you need not
                fear the result of a hundred battles.&rdquo;
                <span className="mt-2 block text-xs text-faint">
                  — Sun Tzu, The Art of War
                </span>
              </dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="rounded-sm bg-accent px-5 py-3 font-mono text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
            >
              Start Contact →
            </a>
            <a
              href="#case-files"
              className="rounded-sm border border-line px-5 py-3 font-mono text-sm text-paper transition-colors hover:border-accent hover:text-accent"
            >
              View Project
            </a>
          </div>
        </div>

        <figure className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
          <div className="absolute -left-2 -top-2 font-mono text-[10px] tracking-widest text-faint">
            PHOTO ID
          </div>
          <div className="relative aspect-3/4 overflow-hidden border border-line bg-panel">
            <Image
              src="/hero.jpg"
              alt={`Subject photo — ${profile.codename}`}
              fill
              priority
              sizes="(min-width: 1024px) 256px, 100vw"
              className="object-cover grayscale contrast-125"
            />
            <span className="pointer-events-none absolute bottom-2 left-2 font-mono text-[10px] tracking-widest text-accent mix-blend-difference">
              CLASSIFIED
            </span>
          </div>
          <figcaption className="mt-2 flex items-center justify-between font-mono text-[10px] tracking-widest text-faint">
            <span>{profile.uid}</span>
            <span>IMG-001</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
