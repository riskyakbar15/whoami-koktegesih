import Link from "next/link";
import { profile } from "../data/portfolio";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-5 py-8 text-center font-mono text-xs text-faint sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <span>
          © {year} {profile.name} All Rights Reserved.
        </span>
        <span className="flex items-center gap-3 tracking-widest">
          <Link
            href="/security-policy"
            className="transition-colors hover:text-accent"
          >
            SECURITY
          </Link>
          <span aria-hidden>·</span>
          {`${profile.uid} // ACCESS GRANTED`}
        </span>
      </div>
    </footer>
  );
}
