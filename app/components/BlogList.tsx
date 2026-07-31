"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "../../lib/format";

type BlogCategory = "writeup" | "tutorial" | "notes" | "article";

export type PostCard = {
  slug: string;
  title: string;
  date: string;
  category: BlogCategory;
  tags: string[];
  summary: string;
};

const FILTERS: { label: string; value: BlogCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Writeups", value: "writeup" },
  { label: "Tutorials", value: "tutorial" },
  { label: "Notes", value: "notes" },
  { label: "Articles", value: "article" },
];

export default function BlogList({ posts }: { posts: PostCard[] }) {
  const [active, setActive] = useState<BlogCategory | "all">("all");
  const visible =
    active === "all" ? posts : posts.filter((post) => post.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2 font-mono text-xs">
        {FILTERS.map((filter) => {
          const isActive = active === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              aria-pressed={isActive ? "true" : "false"}
              onClick={() => setActive(filter.value)}
              className={`inline-flex min-h-10 items-center rounded border px-3 tracking-widest uppercase transition-colors ${
                isActive
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-line text-faint hover:text-paper"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 font-mono text-sm text-faint">
          No entries in this category yet.
        </p>
      ) : (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {visible.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col border border-line bg-panel p-6 transition-colors hover:border-accent/50"
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="tracking-widest text-accent uppercase">
                    {post.category}
                  </span>
                  <span className="text-faint">{formatDate(post.date)}</span>
                </div>
                <h2 className="mt-3 font-display text-xl font-medium text-paper group-hover:text-accent">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {post.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 font-mono text-[11px] text-faint">
                  {post.tags.map((tag) => (
                    <span key={tag} className="border border-line px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
