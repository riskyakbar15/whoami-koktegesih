import type { Metadata } from "next";
import BlogHeader from "../components/BlogHeader";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "Uses",
  description:
    "The tools, lab setup, and daily drivers behind the writeups: offensive security tooling, analysis utilities, and the development stack.",
  alternates: { canonical: "/uses" },
  openGraph: {
    type: "website",
    url: "/uses",
    title: "Uses · Risky Akbar",
    description: "Tools, lab setup, and daily drivers.",
  },
};

type Kit = {
  group: string;
  code: string;
  items: { name: string; note: string }[];
};

const kit: Kit[] = [
  {
    group: "Offensive Security",
    code: "OFF",
    items: [
      {
        name: "Burp Suite",
        note: "Web proxy for intercept, Repeater, Intruder",
      },
      { name: "Nmap", note: "Host discovery and service enumeration" },
      { name: "Metasploit", note: "Exploitation practice against lab targets" },
      { name: "ffuf", note: "Directory and content discovery" },
    ],
  },
  {
    group: "Analysis",
    code: "ANL",
    items: [
      { name: "Wireshark", note: "Packet capture and protocol analysis" },
      { name: "MobSF", note: "Automated static analysis for Android APKs" },
      { name: "JADX", note: "Decompiling APKs for manual source review" },
      { name: "OpenSSL", note: "Certificates and crypto inspection" },
    ],
  },
  {
    group: "Lab Environment",
    code: "LAB",
    items: [
      { name: "Kali Linux", note: "Primary attacker VM" },
      { name: "VirtualBox", note: "Bridged VMs for network labs" },
      { name: "Ubuntu Server", note: "Target and service host, e.g. Asterisk" },
      { name: "Docker", note: "Disposable vulnerable apps and services" },
    ],
  },
  {
    group: "Build & Write",
    code: "DEV",
    items: [
      { name: "VS Code", note: "Editor for code and writeups" },
      { name: "Next.js + TypeScript", note: "This site and other projects" },
      { name: "Tailwind CSS", note: "Styling, CSS-first configuration" },
      { name: "Git + GitHub", note: "Version control and CI" },
    ],
  },
];

export default function UsesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <BlogHeader />
      <main id="main" className="flex-1">
        <section className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
          <p className="font-mono text-xs tracking-widest text-accent uppercase">
            Equipment
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold text-paper sm:text-5xl">
            Uses
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            The tools behind the writeups. Nothing exotic, just what I actually
            reach for in the lab and while building things.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {kit.map((section, i) => (
              <Reveal key={section.code} delay={i * 80}>
                <div className="h-full border border-line border-l-2 border-l-accent/40 bg-panel p-6 transition-colors hover:border-accent/50 hover:border-l-accent">
                  <div className="mb-5 flex items-center gap-3">
                    <h2 className="font-display text-lg font-semibold text-paper">
                      {section.group}
                    </h2>
                    <span className="font-mono text-xs tracking-widest text-accent">
                      [{section.code}]
                    </span>
                  </div>
                  <dl className="space-y-3">
                    {section.items.map((item) => (
                      <div key={item.name}>
                        <dt className="font-mono text-sm text-paper">
                          {item.name}
                        </dt>
                        <dd className="text-sm leading-relaxed text-muted">
                          {item.note}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 border-t border-line pt-6">
            <SectionHeading
              file="NOTE"
              eyebrow="DISCLAIMER"
              title="Lab use only"
            />
            <p className="max-w-2xl text-muted">
              Everything above is used against systems I own or on platforms
              that authorize testing, such as OverTheWire and PortSwigger Web
              Security Academy. Tools are neutral; permission is what makes the
              work legitimate.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
