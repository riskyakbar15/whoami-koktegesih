import fs from "node:fs";
import path from "node:path";

export type BlogCategory = "writeup" | "tutorial" | "notes" | "article";

export const BLOG_CATEGORIES: BlogCategory[] = [
  "writeup",
  "tutorial",
  "notes",
  "article",
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
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

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
  };
}

function readPost(fileName: string): BlogPost {
  const slug = fileName.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), "utf8");
  return parsePost(raw, slug);
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md"))
    .map(readPost)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return readPost(`${slug}.md`);
}
