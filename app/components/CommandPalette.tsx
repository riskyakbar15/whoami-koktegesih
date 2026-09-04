"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type PaletteItem = {
  label: string;
  href: string;
  group: string;
};

export default function CommandPalette({ items }: { items: PaletteItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q),
    );
  }, [items, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setIndex(0);
  }, []);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) {
      lastFocused.current?.focus();
      return;
    }
    lastFocused.current = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i + 1) % results.length : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) =>
        results.length ? (i - 1 + results.length) % results.length : 0,
      );
      return;
    }
    if (e.key === "Enter" && results[index]) {
      e.preventDefault();
      go(results[index].href);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/80 px-4 pt-[15vh] backdrop-blur-sm"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg overscroll-contain border border-line bg-panel shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <span aria-hidden className="font-mono text-xs text-accent">
            &gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            placeholder="Search sections and writeups…"
            aria-label="Search sections and writeups"
            spellCheck={false}
            autoComplete="off"
            className="min-h-12 flex-1 bg-transparent font-mono text-sm text-paper outline-none placeholder:text-faint"
          />
          <kbd className="hidden font-mono text-[10px] tracking-widest text-faint sm:block">
            ESC
          </kbd>
        </div>

        {results.length === 0 ? (
          <p className="px-4 py-6 font-mono text-sm text-faint">No matches.</p>
        ) : (
          <ul className="max-h-80 overflow-y-auto overscroll-contain py-2">
            {results.map((item, i) => (
              <li key={`${item.group}-${item.href}-${item.label}`}>
                <button
                  type="button"
                  onClick={() => go(item.href)}
                  onMouseEnter={() => setIndex(i)}
                  aria-current={i === index ? "true" : undefined}
                  className={`flex min-h-11 w-full items-center justify-between gap-4 px-4 text-left text-sm transition-colors ${
                    i === index ? "bg-panel-2 text-accent" : "text-muted"
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  <span className="shrink-0 font-mono text-[10px] tracking-widest text-faint uppercase">
                    {item.group}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
