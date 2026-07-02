"use client";

import { useEffect, useRef, useState } from "react";

type RedactedProps = {
  children: string;
  className?: string;
};

/**
 * Signature element: text hidden behind a redaction bar that "declassifies"
 * when scrolled into view. Also reveals on hover/focus for interactivity.
 */
export default function Redacted({ children, className = "" }: RedactedProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [clear, setClear] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const timer = window.setTimeout(() => setClear(true), 260);
            observer.unobserve(entry.target);
            return () => window.clearTimeout(timer);
          }
        });
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={`redacted ${clear ? "is-clear" : ""} ${className}`}
      onMouseEnter={() => setClear(true)}
      onFocus={() => setClear(true)}
      tabIndex={0}
      aria-label={children}
    >
      {children}
    </span>
  );
}
