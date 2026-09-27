import type { Metadata } from "next";
import Link from "next/link";
import BlogHeader from "../components/BlogHeader";
import Footer from "../components/Footer";
import { getAllTags } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Tag Index",
  description:
    "Every topic covered in the field notes of Risky Akbar, from nmap and Wireshark to malware analysis and CTF writeups.",
  alternates: { canonical: "/tags" },
  openGraph: {
    type: "website",
    url: "/tags",
    title: "Tag Index · Risky Akbar",
    description: "Every topic covered in the field notes of Risky Akbar.",
  },
};

export default function TagIndexPage() {
  const tags = getAllTags();

  return (
    <div className="flex flex-1 flex-col">
      <BlogHeader backHref="/blog" backLabel="BACK TO FIELD NOTES" />
      <main id="main" className="flex-1">
        <section className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
          <p className="font-mono text-xs tracking-widest text-accent uppercase">
            Index
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold text-paper sm:text-5xl">
            Tag Index
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            {tags.length} topics across the archive. Pick a thread and follow
            it.
          </p>

          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tags.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={`/tags/${entry.slug}`}
                  className="flex items-center justify-between gap-3 border border-line bg-panel px-4 py-3 font-mono text-sm transition-colors hover:border-accent/50"
                >
                  <span className="truncate text-paper">{entry.tag}</span>
                  <span className="shrink-0 text-xs text-faint">
                    {String(entry.count).padStart(2, "0")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
