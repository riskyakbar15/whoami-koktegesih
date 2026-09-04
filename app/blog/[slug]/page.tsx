import type { Metadata } from "next";
import {
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BlogHeader from "../../components/BlogHeader";
import CodeBlock from "../../components/CodeBlock";
import ArticleLanguages from "../../components/ArticleLanguages";
import Footer from "../../components/Footer";
import { formatDate } from "@/lib/format";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";

type Params = { params: Promise<{ slug: string }> };

const SITE_URL = "https://riskyakbar.my.id";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

// Keep wide tables from overflowing the viewport on small screens.
function MarkdownTable({
  node,
  ...props
}: ComponentPropsWithoutRef<"table"> & { node?: unknown }) {
  return (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  );
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (isValidElement(node)) {
    return toText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

function Heading2({
  node,
  children,
  ...props
}: ComponentPropsWithoutRef<"h2"> & { node?: unknown }) {
  return (
    <h2 id={slugify(toText(children))} {...props}>
      {children}
    </h2>
  );
}

function Heading3({
  node,
  children,
  ...props
}: ComponentPropsWithoutRef<"h3"> & { node?: unknown }) {
  return (
    <h3 id={slugify(toText(children))} {...props}>
      {children}
    </h3>
  );
}

// Top-level headings only, ignoring anything inside fenced code blocks.
function extractHeadings(md: string) {
  const prose = md.replace(/```[\s\S]*?```/g, "");
  const matches = prose.matchAll(/^##\s+(.+)$/gm);
  return Array.from(matches, (m) => {
    const text = m[1].replace(/[`*_]/g, "").trim();
    return { id: slugify(text), text };
  });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${slug}`,
      title: `${post.title} · Risky Akbar`,
      description: post.summary,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const renderMarkdown = (md: string) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        pre: CodeBlock,
        table: MarkdownTable,
        h2: Heading2,
        h3: Heading3,
      }}
    >
      {md}
    </ReactMarkdown>
  );

  // Only worth showing once a post has enough sections to navigate.
  const renderToc = (md: string) => {
    const headings = extractHeadings(md);
    if (headings.length < 4) return null;
    return (
      <nav
        aria-label="Table of contents"
        className="mb-10 border border-line border-l-2 border-l-accent/40 bg-panel p-5"
      >
        <p className="font-mono text-[10px] tracking-widest text-faint">
          {"// CONTENTS"}
        </p>
        <ol className="mt-3 space-y-2">
          {headings.map((heading, i) => (
            <li key={heading.id} className="flex gap-3 text-sm">
              <span className="font-mono text-[10px] leading-5 text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <a
                href={`#${heading.id}`}
                className="text-muted transition-colors hover:text-accent"
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    );
  };

  const renderArticle = (md: string) => (
    <>
      {renderToc(md)}
      {renderMarkdown(md)}
    </>
  );

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.tags.join(", "),
    articleSection: post.category,
    inLanguage: post.contentId ? ["en", "id"] : "en",
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
    url: `${SITE_URL}/blog/${slug}`,
    image: `${SITE_URL}/blog/${slug}/opengraph-image`,
    author: { "@type": "Person", name: "Risky Akbar", url: SITE_URL },
    publisher: { "@type": "Person", name: "Risky Akbar", url: SITE_URL },
  };

  return (
    <div className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <BlogHeader backHref="/blog" backLabel="BACK TO FIELD NOTES" />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
          <p className="font-mono text-xs tracking-widest text-accent uppercase">
            {post.category}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-paper sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-faint">
            <span>{formatDate(post.date)}</span>
            <span>{post.readingMinutes} min read</span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="border border-line px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {post.contentId ? (
            <div className="mt-10">
              <ArticleLanguages
                en={renderArticle(post.content)}
                id={renderArticle(post.contentId)}
              />
            </div>
          ) : (
            <div className="prose-dossier mt-10">
              {renderArticle(post.content)}
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
