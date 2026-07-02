import Link from "next/link";
import { profile } from "../data/portfolio";

export default function BlogHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 font-mono text-xs">
        <Link
          href="/"
          className="inline-flex min-h-10 items-center gap-2 text-faint transition-colors hover:text-accent"
        >
          <span aria-hidden>←</span> RETURN TO DOSSIER
        </Link>
        <span className="tracking-widest text-faint">
          {profile.codename}{" "}
          <span className="text-accent">{"// FIELD NOTES"}</span>
        </span>
      </div>
    </header>
  );
}
