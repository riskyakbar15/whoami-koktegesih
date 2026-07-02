import type { ReactNode } from "react";

type SectionHeadingProps = {
  file: string;
  eyebrow: string;
  title: ReactNode;
};

export default function SectionHeading({
  file,
  eyebrow,
  title,
}: SectionHeadingProps) {
  return (
    <div className="mb-10 border-b border-line pb-5">
      <div className="mb-3 flex items-center gap-3 font-mono text-xs tracking-widest text-accent">
        <span>{file}</span>
        <span className="h-px flex-1 bg-line" />
        <span className="text-faint">{eyebrow}</span>
      </div>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
