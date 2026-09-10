"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatDate } from "../../lib/format";

type BlogCategory = "writeup" | "tutorial" | "notes" | "article" | "log";

export type PostCard = {
  slug: string;
  title: string;
  date: string;
  category: BlogCategory;
  tags: string[];
  summary: string;
  readingMinutes: number;
};

// `log` is personal writing: kept out of the base filters and the default view.
const FILTERS: { label: string; value: BlogCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Writeups", value: "writeup" },
  { label: "Tutorials", value: "tutorial" },
  { label: "Notes", value: "notes" },
  { label: "Articles", value: "article" },
];

const CATEGORIES = new Set<string>([
  "all",
  "writeup",
  "tutorial",
  "notes",
  "article",
  "log",
]);

export default function BlogList({ posts }: { posts: PostCard[] }) {
  const router = useRouter();
  const params = useSearchParams();

  const rawCategory = params.get("category");
  const active =
    rawCategory && CATEGORIES.has(rawCategory)
      ? (rawCategory as BlogCategory)
      : "all";
  const tag = params.get("tag");

  // Log posts stay out of the default "All" view; reachable via their own filter.
  const filters = posts.some((post) => post.category === "log")
    ? [...FILTERS, { label: "Log", value: "log" as const }]
    : FILTERS;

  const visible = posts.filter(
    (post) =>
      (active === "all" ? post.category !== "log" : post.category === active) &&
      (!tag || post.tags.includes(tag)),
  );

  const buildHref = (next: {
    category?: BlogCategory | "all";
    tag?: string | null;
  }) => {
    const query = new URLSearchParams();
    const category = next.category ?? active;
    const nextTag = next.tag === undefined ? tag : next.tag;
    if (category !== "all") query.set("category", category);
    if (nextTag) query.set("tag", nextTag);
    const qs = query.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 font-mono text-xs">
        {filters.map((filter) => {
          const isActive = active === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              aria-pressed={isActive ? "true" : "false"}
              onClick={() =>
                router.replace(buildHref({ category: filter.value }), {
                  scroll: false,
                })
              }
              className={`inline-flex min-h-11 items-center rounded border px-3 tracking-widest uppercase transition-colors ${
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

      {tag && (
        <p className="mt-4 flex flex-wrap items-center gap-2 font-mono text-xs text-faint">
          <span>Filtered by tag</span>
          <Link
            href={buildHref({ tag: null })}
            className="inline-flex min-h-8 items-center gap-2 border border-accent bg-accent/15 px-2 text-accent"
          >
            {tag}
            <span aria-hidden>✕</span>
            <span className="sr-only">Clear tag filter</span>
          </Link>
        </p>
      )}

      {visible.length === 0 ? (
        <p className="mt-10 font-mono text-sm text-faint">
          No entries match this filter yet.
        </p>
      ) : (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {visible.map((post) => (
            <li
              key={post.slug}
              className="group relative flex flex-col border border-line bg-panel p-6 transition-colors hover:border-accent/50"
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="tracking-widest text-accent uppercase">
                  {post.category}
                </span>
                <span className="text-faint">
                  {formatDate(post.date)} · {post.readingMinutes} min
                </span>
              </div>
              <h2 className="mt-3 font-display text-xl font-medium text-paper group-hover:text-accent">
                <Link
                  href={`/blog/${post.slug}`}
                  className="before:absolute before:inset-0"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {post.summary}
              </p>
              <div className="relative mt-4 flex flex-wrap gap-2 font-mono text-[11px]">
                {post.tags.map((postTag) => (
                  <Link
                    key={postTag}
                    href={buildHref({ tag: postTag })}
                    className={`border px-2 py-0.5 transition-colors ${
                      postTag === tag
                        ? "border-accent text-accent"
                        : "border-line text-faint hover:border-accent/50 hover:text-accent"
                    }`}
                  >
                    {postTag}
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
