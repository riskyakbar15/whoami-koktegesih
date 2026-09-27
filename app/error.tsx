"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main
      id="main"
      className="flex min-h-screen flex-col items-center justify-center px-5 text-center"
    >
      <p className="inline-flex items-center gap-2 border border-line bg-panel px-3 py-1 font-mono text-xs tracking-widest text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        ERROR 500 // SIGNAL LOST
      </p>
      <h1 className="mt-8 font-display text-5xl font-bold tracking-tight text-paper sm:text-7xl">
        Transmission Failed
      </h1>
      <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-muted">
        Something broke while decoding this file. The incident has been logged
        locally and no data was lost.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-sm bg-accent px-5 py-3 font-mono text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
        >
          Retry
        </button>
        <Link
          href="/"
          className="rounded-sm border border-line px-5 py-3 font-mono text-sm text-muted transition-colors hover:border-accent/50 hover:text-accent"
        >
          ← Return to Dossier
        </Link>
      </div>
    </main>
  );
}
