import fs from "node:fs";
import path from "node:path";
import { slugify } from "./markdown";

export type BlogCategory = "writeup" | "tutorial" | "notes" | "article" | "log";

export const BLOG_CATEGORIES: BlogCategory[] = [
  "writeup",
  "tutorial",
  "notes",
  "article",
  "log",
];

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  category: BlogCategory;
  tags: string[];
  summary: string;
  content: string;
  contentId?: string;
  readingMinutes: number;
  draft: boolean;
  series?: string;
  part?: number;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// Drafts stay visible while writing locally and are dropped from production builds.
const INCLUDE_DRAFTS = process.env.NODE_ENV === "development";

function parseFrontmatter(raw: string): {
  data: Record<string, string>;
  body: string;
} {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw);
  if (!match) {
    return { data: {}, body: raw };
  }
  const [, frontmatter, body] = match;
  const data: Record<string, string> = {};
  for (const line of frontmatter.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return { data, body: body ?? "" };
}

function parseTags(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(",")
    .map((tag) => tag.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function toCategory(value: string | undefined): BlogCategory {
  return BLOG_CATEGORIES.includes(value as BlogCategory)
    ? (value as BlogCategory)
    : "article";
}

export function parsePost(raw: string, slug: string): BlogPost {
  const { data, body } = parseFrontmatter(raw);
  // A `<!-- lang:id -->` marker splits the body into English and Indonesian.
  const [en, id] = body.trim().split(/\n?<!--\s*lang:id\s*-->\n?/i);
  // Standalone HTML comments (e.g. markdownlint directives) must not render.
  const clean = (md: string) =>
    md.replace(/^[ \t]*<!--[\s\S]*?-->[ \t]*$/gm, "").trim();
  const content = clean(en);
  const words = content.split(/\s+/).filter(Boolean).length;
  const part = Number.parseInt(data.part ?? "", 10);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    category: toCategory(data.category),
    tags: parseTags(data.tags),
    summary: data.summary ?? "",
    content,
    contentId: id ? clean(id) : undefined,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    draft: data.draft === "true",
    series: data.series || undefined,
    part: Number.isNaN(part) ? undefined : part,
  };
}

function readPost(fileName: string): BlogPost {
  const slug = fileName.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), "utf8");
  return parsePost(raw, slug);
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md"))
    .map(readPost)
    .filter((post) => INCLUDE_DRAFTS || !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  // Routes already restrict slugs, but this keeps fs access safe on its own.
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const post = readPost(`${slug}.md`);
  if (post.draft && !INCLUDE_DRAFTS) return null;
  return post;
}

/** Technical posts only; `log` is personal writing kept out of feeds and indexes. */
export function getPublicPosts(): BlogPost[] {
  return getAllPosts().filter((post) => post.category !== "log");
}

export function tagSlug(tag: string): string {
  return slugify(tag);
}

export type TagSummary = { tag: string; slug: string; count: number };

export function getAllTags(): TagSummary[] {
  const seen = new Map<string, { tag: string; count: number }>();
  for (const post of getPublicPosts()) {
    for (const tag of post.tags) {
      const slug = tagSlug(tag);
      if (!slug) continue;
      const entry = seen.get(slug);
      if (entry) entry.count += 1;
      else seen.set(slug, { tag, count: 1 });
    }
  }
  return [...seen.entries()]
    .map(([slug, { tag, count }]) => ({ tag, slug, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(slug: string): BlogPost[] {
  return getPublicPosts().filter((post) =>
    post.tags.some((tag) => tagSlug(tag) === slug),
  );
}

// Log posts navigate among themselves so personal writing never leads into technical notes.
function siblingsOf(post: BlogPost, posts: BlogPost[]): BlogPost[] {
  return post.category === "log"
    ? posts.filter((p) => p.category === "log")
    : posts.filter((p) => p.category !== "log");
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const posts = getAllPosts();
  const current = posts.find((post) => post.slug === slug);
  if (!current) return [];
  return siblingsOf(current, posts)
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      score:
        post.tags.filter((tag) => current.tags.includes(tag)).length * 2 +
        (post.category === current.category ? 1 : 0),
    }))
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || (a.post.date < b.post.date ? 1 : -1),
    )
    .slice(0, limit)
    .map((entry) => entry.post);
}

export function getAdjacentPosts(slug: string): {
  previous: BlogPost | null;
  next: BlogPost | null;
} {
  const posts = getAllPosts();
  const current = posts.find((post) => post.slug === slug);
  if (!current) return { previous: null, next: null };
  const siblings = siblingsOf(current, posts);
  const index = siblings.findIndex((post) => post.slug === slug);
  if (index === -1) return { previous: null, next: null };
  // `posts` is newest-first, so the older post sits at the higher index.
  return {
    previous: siblings[index + 1] ?? null,
    next: siblings[index - 1] ?? null,
  };
}

export function getSeries(name: string): BlogPost[] {
  return getAllPosts()
    .filter((post) => post.series === name)
    .sort((a, b) => (a.part ?? 0) - (b.part ?? 0));
}
