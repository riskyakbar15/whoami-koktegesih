import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BlogHeader from "../../components/BlogHeader";
import Footer from "../../components/Footer";
import { formatDate } from "@/lib/format";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

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

  return (
    <div className="flex flex-1 flex-col">
      <BlogHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-5 py-16">
          <p className="font-mono text-xs tracking-widest text-accent uppercase">
            {post.category}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-paper sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-faint">
            <span>{formatDate(post.date)}</span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="border border-line px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="prose-dossier mt-10">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
