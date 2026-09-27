import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogHeader from "../../components/BlogHeader";
import Footer from "../../components/Footer";
import { formatDate } from "@/lib/format";
import { getAllTags, getPostsByTag } from "@/lib/blog";

type Params = { params: Promise<{ tag: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map((entry) => ({ tag: entry.slug }));
}

function labelFor(slug: string): string | null {
  return getAllTags().find((entry) => entry.slug === slug)?.tag ?? null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { tag } = await params;
  const label = labelFor(tag);
  if (!label) return {};
  const count = getPostsByTag(tag).length;
  const description = `${count} field note${count === 1 ? "" : "s"} tagged "${label}" by Risky Akbar.`;
  return {
    title: `#${label}`,
    description,
    alternates: { canonical: `/tags/${tag}` },
    openGraph: {
      type: "website",
      url: `/tags/${tag}`,
      title: `#${label} · Risky Akbar`,
      description,
    },
  };
}

export default async function TagPage({ params }: Params) {
  const { tag } = await params;
  const label = labelFor(tag);
  if (!label) notFound();
  const posts = getPostsByTag(tag);

  return (
    <div className="flex flex-1 flex-col">
      <BlogHeader backHref="/tags" backLabel="BACK TO TAG INDEX" />
      <main id="main" className="flex-1">
        <section className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
          <p className="font-mono text-xs tracking-widest text-accent uppercase">
            Tagged
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold text-paper sm:text-5xl">
            #{label}
          </h1>
          <p className="mt-4 font-mono text-xs text-faint">
            {String(posts.length).padStart(2, "0")} ENTRIES
          </p>

          <ul className="mt-12 space-y-4">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="relative border border-line bg-panel p-5 transition-colors hover:border-accent/50"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-faint">
                  <span className="text-accent uppercase">{post.category}</span>
                  <span>{formatDate(post.date)}</span>
                  <span>{post.readingMinutes} min read</span>
                </div>
                <h2 className="mt-2 font-display text-xl font-semibold text-paper">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="before:absolute before:inset-0"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {post.summary}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
