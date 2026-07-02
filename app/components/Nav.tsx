"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const links = [
  { href: "#subject", label: "01 / Subject", short: "01" },
  { href: "#profile", label: "02 / Profile", short: "02" },
  { href: "#capabilities", label: "03 / Capabilities", short: "03" },
  { href: "#case-files", label: "04 / Case Files", short: "04" },
  { href: "#certifications", label: "05 / Certifications", short: "05" },
  { href: "#track-record", label: "06 / Experience", short: "06" },
  { href: "#contact", label: "07 / Contact", short: "07" },
  { href: "/blog", label: "Blog ↗", short: "BLOG" },
];

export default function Nav() {
  const [active, setActive] = useState<string>("#subject");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach((l) => {
      if (!l.href.startsWith("#")) return;
      const el = document.querySelector(l.href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="File navigation"
      className="sticky top-9 z-30 border-b border-line bg-ink/80 backdrop-blur"
    >
      <ul className="mx-auto flex max-w-5xl justify-between gap-0.5 overflow-x-auto px-4 py-2 font-mono text-[11px] sm:text-xs">
        {links.map((l) => {
          const isActive = active === l.href;
          const className = `inline-flex min-h-10 items-center rounded px-2 transition-colors sm:px-2.5 ${
            isActive
              ? "bg-accent/15 text-accent"
              : "text-faint hover:text-paper"
          }`;
          return (
            <li key={l.href} className="shrink-0">
              {l.href.startsWith("#") ? (
                <a href={l.href} className={className}>
                  <span className="sm:hidden">{l.short}</span>
                  <span className="hidden sm:inline">{l.label}</span>
                </a>
              ) : (
                <Link href={l.href} className={className}>
                  <span className="sm:hidden">{l.short}</span>
                  <span className="hidden sm:inline">{l.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
