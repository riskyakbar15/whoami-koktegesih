import Link from "next/link";
import { profile } from "../data/portfolio";

type BlogHeaderProps = {
  backHref?: string;
  backLabel?: string;
};

export default function BlogHeader({
  backHref = "/",
  backLabel = "RETURN TO DOSSIER",
}: BlogHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 font-mono text-xs">
        <Link
          href={backHref}
          className="inline-flex min-h-10 shrink-0 items-center gap-2 text-faint transition-colors hover:text-accent"
        >
          <span aria-hidden>←</span> {backLabel}
        </Link>
        <span className="min-w-0 truncate tracking-widest text-faint">
          <span className="hidden sm:inline">{profile.codename} </span>
          <span className="text-accent">{"// FIELD NOTES"}</span>
        </span>
      </div>
    </header>
  );
}
