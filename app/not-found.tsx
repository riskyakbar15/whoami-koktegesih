import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="inline-flex items-center gap-2 border border-line bg-panel px-3 py-1 font-mono text-xs tracking-widest text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        ERROR 404 — FILE NOT FOUND
      </p>
      <h1 className="mt-8 font-display text-6xl font-bold tracking-tight text-paper sm:text-8xl">
        404
      </h1>
      <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-muted">
        The requested file has been redacted, relocated, or never existed in
        this archive.
      </p>
      <Link
        href="/"
        className="mt-10 rounded-sm bg-accent px-5 py-3 font-mono text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
      >
        ← Return to Dossier
      </Link>
    </main>
  );
}
