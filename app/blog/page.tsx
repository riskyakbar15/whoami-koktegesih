import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import BlogHeader from "../components/BlogHeader";
import BlogList from "../components/BlogList";
import Footer from "../components/Footer";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Field Notes",
  description:
    "Writeups, tutorials, and notes on offensive security, networking, and CTF practice by Risky Akbar.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Field Notes · Risky Akbar",
    description:
      "Writeups, tutorials, and notes on offensive security, networking, and CTF practice.",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    category: post.category,
    tags: post.tags,
    summary: post.summary,
    readingMinutes: post.readingMinutes,
  }));

  return (
    <div className="flex flex-1 flex-col">
      <BlogHeader />
      <main id="main" className="flex-1">
        <section className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
          <p className="font-mono text-xs tracking-widest text-accent uppercase">
            Field Notes
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold text-paper sm:text-5xl">
            Writeups &amp; Notes
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Documented findings from labs, wargames, and CTFs, plus notes on
            networking and offensive security as I learn.
          </p>
          <Link
            href="/tags"
            className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-faint transition-colors hover:text-accent"
          >
            Browse the tag index <span aria-hidden>→</span>
          </Link>
          <div className="mt-12">
            <Suspense fallback={null}>
              <BlogList posts={posts} />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
