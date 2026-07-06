"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import {
  badges,
  certificates,
  profile,
  type Certificate,
} from "../data/portfolio";

export default function CredentialsGallery() {
  const [active, setActive] = useState<Certificate | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lastFocusedRef.current?.focus();
    };
  }, [active, close]);

  const blockContext = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div className="mt-10 space-y-14">
      {/* Digital Badges */}
      <div>
        <p className="mb-5 font-mono text-xs tracking-widest text-faint">
          {"// DIGITAL BADGES"}
        </p>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {badges.map((badge, i) => (
            <li key={badge.name}>
              <Reveal delay={i * 60}>
                <div className="flex h-full flex-col items-center border border-line bg-panel p-5 text-center transition-colors hover:border-accent/50">
                  <div
                    className="relative h-24 w-24 select-none"
                    onContextMenu={blockContext}
                  >
                    <Image
                      src={badge.image}
                      alt={`Badge — ${badge.name}`}
                      fill
                      draggable={false}
                      sizes="96px"
                      className="pointer-events-none object-contain"
                    />
                  </div>
                  <h3 className="mt-4 font-display text-sm font-medium leading-snug text-paper">
                    {badge.name}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] text-faint">
                    {badge.issuer}
                  </p>
                  {badge.verifyHref && (
                    <a
                      href={badge.verifyHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 font-mono text-[11px] tracking-widest text-secure transition-colors hover:text-accent"
                    >
                      Verify ↗
                    </a>
                  )}
                  {badge.verifyHref && (
                    <span className="mt-auto flex items-center gap-1.5 pt-4 font-mono text-[10px] tracking-wide text-faint">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b00]" />
                      Powered by Credly
                    </span>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      {/* Certificates */}
      <div>
        <p className="mb-5 font-mono text-xs tracking-widest text-faint">
          {"// CERTIFICATES"}
        </p>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => {
            const ref = `CERT-${String(i + 1).padStart(2, "0")}`;
            return (
              <li key={cert.name}>
                <Reveal delay={i * 60}>
                  <button
                    type="button"
                    onClick={() => setActive(cert)}
                    className="group block w-full border border-line bg-panel text-left transition-colors hover:border-accent/50"
                  >
                    <div
                      className="relative aspect-4/3 select-none overflow-hidden border-b border-line"
                      onContextMenu={blockContext}
                    >
                      <Image
                        src={cert.image}
                        alt={`Certificate — ${cert.name}`}
                        fill
                        draggable={false}
                        sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
                        className="pointer-events-none object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      {/* transparent overlay to intercept right-click / drag */}
                      <span className="absolute inset-0" aria-hidden="true" />
                      <span className="absolute left-2 top-2 font-mono text-[10px] tracking-widest text-accent mix-blend-difference">
                        {ref}
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="font-display text-base font-medium text-paper">
                        {cert.name}
                      </h3>
                      <p className="mt-0.5 font-mono text-xs text-faint">
                        {cert.issuer} · {cert.year}
                      </p>
                    </div>
                  </button>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Lightbox (view-only) */}
      {active && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-5 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={active.name}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 border border-line bg-panel px-3 py-1 font-mono text-xs tracking-widest text-paper transition-colors hover:border-accent hover:text-accent"
          >
            ESC ✕
          </button>
          <figure
            className="relative max-h-[85vh] w-full max-w-3xl select-none"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={blockContext}
          >
            <div className="relative">
              <Image
                src={active.image}
                alt={`Certificate — ${active.name}`}
                width={1200}
                height={900}
                draggable={false}
                sizes="(min-width: 768px) 768px, 100vw"
                className="pointer-events-none h-auto max-h-[85vh] w-full object-contain"
              />
              {/* transparent overlay + watermark deterrent */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                <span className="rotate-[-30deg] whitespace-nowrap font-mono text-4xl uppercase tracking-widest text-paper/10 sm:text-6xl">
                  {profile.codename} · {profile.codename}
                </span>
              </div>
              <span className="absolute inset-0" aria-hidden="true" />
            </div>
            <figcaption className="mt-3 flex items-center justify-between font-mono text-[11px] tracking-widest text-faint">
              <span>{active.name}</span>
              <span>
                {active.issuer} · {active.year}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
