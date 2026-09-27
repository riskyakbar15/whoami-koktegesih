import { isValidElement, type ReactNode } from "react";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function toText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (isValidElement(node)) {
    return toText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

export type Heading = { id: string; text: string };

// Top-level headings only, ignoring anything inside fenced code blocks.
export function extractHeadings(md: string): Heading[] {
  const prose = md.replace(/```[\s\S]*?```/g, "");
  return Array.from(prose.matchAll(/^##\s+(.+)$/gm), (match) => {
    const text = match[1].replace(/[*_`]/g, "").trim();
    return { id: slugify(text), text };
  });
}
