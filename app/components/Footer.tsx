import { profile } from "../data/portfolio";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-5 py-8 text-center font-mono text-xs text-faint sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <span>
          © {year} {profile.name} All Rights Reserved.
        </span>
        <span className="tracking-widest">
          {`END OF FILE // ${profile.uid} // ACCESS GRANTED`}
        </span>
      </div>
    </footer>
  );
}
