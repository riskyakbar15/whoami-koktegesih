import type { Metadata } from "next";
import BlogHeader from "../components/BlogHeader";
import Footer from "../components/Footer";
import { socials } from "../data/portfolio";

export const metadata: Metadata = {
  title: "Security Policy",
  description:
    "Vulnerability disclosure policy for riskyakbar.my.id: scope, rules of engagement, and what is not accepted.",
  alternates: { canonical: "/security-policy" },
  openGraph: {
    type: "website",
    url: "/security-policy",
    title: "Security Policy · Risky Akbar",
    description: "Vulnerability disclosure policy for riskyakbar.my.id.",
  },
};

const IN_SCOPE = ["riskyakbar.my.id and its subdomains"];

const OUT_OF_SCOPE = [
  "Third party services linked from this site (GitHub, LinkedIn, Instagram, Credly)",
  "The hosting platform itself; report those to Vercel",
  "Any system that is not owned by me",
];

const RULES = [
  "Do not run automated scanners, fuzzers, or brute force tools against this site.",
  "Do not attempt denial of service, or anything that degrades availability for others.",
  "Do not attempt social engineering, phishing, or physical access.",
  "Do not access, modify, or exfiltrate data that is not yours.",
  "Stop as soon as you have proof of concept, and report it.",
];

const NOT_ACCEPTED = [
  "Raw output from automated scanners with no demonstrated impact",
  "Missing SPF, DKIM, or DMARC records; this domain does not send email",
  "Clickjacking on pages with no state changing actions",
  "Missing security headers with no working exploit path",
  "Best practice suggestions that do not describe a concrete attack",
  "Disclosure of information that is already public by design, such as my contact address",
];

export default function SecurityPolicyPage() {
  const email = socials.find((social) => social.href.startsWith("mailto:"));

  return (
    <div className="flex flex-1 flex-col">
      <BlogHeader />
      <main id="main" className="flex-1">
        <section className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
          <p className="font-mono text-xs tracking-widest text-accent uppercase">
            Disclosure
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold text-paper sm:text-5xl">
            Security Policy
          </h1>
          <p className="mt-4 text-muted">
            This is a personal portfolio site. It is statically generated, has
            no user accounts, no database, and stores no visitor data. Reports
            are still welcome, and I will read every one of them.
          </p>

          <div className="mt-10 border border-line border-l-2 border-l-gold/50 bg-panel p-5">
            <p className="font-mono text-[10px] tracking-widest text-gold">
              {"// NO BOUNTY"}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              There is no bug bounty program here and no monetary reward of any
              kind. I am a student running this site personally. Reports sent
              with an invoice, a payment demand, or a request for compensation
              will be closed without a reply. If that is a dealbreaker for you,
              please do not spend your time on this site.
            </p>
          </div>

          <h2 className="mt-12 font-display text-xl font-semibold text-paper">
            In scope
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {IN_SCOPE.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="font-mono text-accent">+</span>
                {item}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 font-display text-xl font-semibold text-paper">
            Out of scope
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {OUT_OF_SCOPE.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="font-mono text-faint">-</span>
                {item}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 font-display text-xl font-semibold text-paper">
            Rules of engagement
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {RULES.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="font-mono text-accent">!</span>
                {item}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 font-display text-xl font-semibold text-paper">
            Reports I will not action
          </h2>
          <p className="mt-3 text-sm text-muted">
            These are common on static sites and carry no real impact here:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {NOT_ACCEPTED.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="font-mono text-faint">x</span>
                {item}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 font-display text-xl font-semibold text-paper">
            How to report
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Email me with the affected URL, the steps to reproduce, and what an
            attacker could actually achieve. Proof of concept code or a short
            screen recording helps. English or Indonesian are both fine.
          </p>
          {email && (
            <p className="mt-4 font-mono text-sm">
              <a
                href={email.href}
                className="text-accent transition-colors hover:text-paper"
              >
                {email.value}
              </a>
            </p>
          )}
          <p className="mt-4 text-sm leading-relaxed text-muted">
            I aim to acknowledge valid reports within seven days. Please give me
            reasonable time to fix an issue before publishing it. I am happy to
            credit you once it is resolved.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
