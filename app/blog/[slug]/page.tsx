import type { Metadata } from "next";
import { type ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BlogHeader from "../../components/BlogHeader";
import CodeBlock from "../../components/CodeBlock";
import ArticleLanguages from "../../components/ArticleLanguages";
import Footer from "../../components/Footer";
import { formatDate } from "@/lib/format";
import { extractHeadings, slugify, toText } from "@/lib/markdown";
import {
  getAdjacentPosts,
  getAllSlugs,
  getPostBySlug,
  getRelatedPosts,
  getSeries,
  tagSlug,
} from "@/lib/blog";

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

  const related = getRelatedPosts(slug);
  const { previous, next } = getAdjacentPosts(slug);
  const series = post.series ? getSeries(post.series) : [];

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
                <Link
                  key={tag}
                  href={`/tags/${tagSlug(tag)}`}
                  className="border border-line px-2 py-0.5 transition-colors hover:border-accent/50 hover:text-accent"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {series.length > 1 && (
            <nav
              aria-label={`${post.series} series`}
              className="mt-10 border border-line border-l-2 border-l-gold/50 bg-panel p-5"
            >
              <p className="font-mono text-[10px] tracking-widest text-faint">
                {"// SERIES"}
                <span className="ml-2 text-gold">{post.series}</span>
              </p>
              <ol className="mt-3 space-y-2">
                {series.map((entry, i) => {
                  const current = entry.slug === post.slug;
                  return (
                    <li key={entry.slug} className="flex gap-3 text-sm">
                      <span className="font-mono text-[10px] leading-5 text-gold">
                        {String(entry.part ?? i + 1).padStart(2, "0")}
                      </span>
                      {current ? (
                        <span
                          aria-current="page"
                          className="font-medium text-paper"
                        >
                          {entry.title}
                        </span>
                      ) : (
                        <Link
                          href={`/blog/${entry.slug}`}
                          className="text-muted transition-colors hover:text-accent"
                        >
                          {entry.title}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}

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

          {related.length > 0 && (
            <section
              aria-labelledby="related-heading"
              className="mt-16 border-t border-line pt-8"
            >
              <h2
                id="related-heading"
                className="font-mono text-[10px] tracking-widest text-faint"
              >
                {"// RELATED FILES"}
              </h2>
              <ul className="mt-4 space-y-3">
                {related.map((item) => (
                  <li
                    key={item.slug}
                    className="relative border border-line bg-panel p-4 transition-colors hover:border-accent/50"
                  >
                    <p className="font-mono text-[11px] text-faint">
                      <span className="text-accent uppercase">
                        {item.category}
                      </span>
                      <span className="mx-2">/</span>
                      {item.readingMinutes} min read
                    </p>
                    <p className="mt-1 font-display text-base font-semibold text-paper">
                      <Link
                        href={`/blog/${item.slug}`}
                        className="before:absolute before:inset-0"
                      >
                        {item.title}
                      </Link>
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(previous || next) && (
            <nav
              aria-label="Post navigation"
              className="mt-10 grid gap-3 border-t border-line pt-8 sm:grid-cols-2"
            >
              {previous ? (
                <Link
                  href={`/blog/${previous.slug}`}
                  rel="prev"
                  className="border border-line bg-panel p-4 transition-colors hover:border-accent/50"
                >
                  <span className="font-mono text-[10px] tracking-widest text-faint">
                    ← OLDER
                  </span>
                  <span className="mt-1 block text-sm text-paper">
                    {previous.title}
                  </span>
                </Link>
              ) : (
                <span aria-hidden className="hidden sm:block" />
              )}
              {next && (
                <Link
                  href={`/blog/${next.slug}`}
                  rel="next"
                  className="border border-line bg-panel p-4 text-right transition-colors hover:border-accent/50 sm:col-start-2"
                >
                  <span className="font-mono text-[10px] tracking-widest text-faint">
                    NEWER →
                  </span>
                  <span className="mt-1 block text-sm text-paper">
                    {next.title}
                  </span>
                </Link>
              )}
            </nav>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
