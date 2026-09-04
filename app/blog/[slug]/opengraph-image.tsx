import { ImageResponse } from "next/og";
import { formatDate } from "@/lib/format";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";

export const alt = "Field Notes writeup";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

type Params = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Params) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? "Field Notes";
  const category = post?.category ?? "writeup";
  const meta = post
    ? `${formatDate(post.date)} · ${post.readingMinutes} min read`
    : "riskyakbar.my.id";
  const titleSize = title.length > 55 ? 46 : title.length > 40 ? 54 : 64;

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0e1116",
        padding: "80px",
        fontFamily: "monospace",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          bottom: 24,
          left: 24,
          border: "2px solid #2a3342",
        }}
      />
      <div
        style={{
          display: "flex",
          fontSize: 24,
          letterSpacing: 6,
          color: "#ff5c38",
          textTransform: "uppercase",
        }}
      >
        {`${category} // FIELD NOTES`}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 32,
          fontSize: titleSize,
          fontWeight: 700,
          lineHeight: 1.15,
          color: "#edede6",
          flex: 1,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 24,
          letterSpacing: 2,
          color: "#8a94a6",
        }}
      >
        <div style={{ display: "flex" }}>{meta}</div>
        <div style={{ display: "flex", color: "#5c6675" }}>
          riskyakbar.my.id
        </div>
      </div>
    </div>,
    { ...size },
  );
}
