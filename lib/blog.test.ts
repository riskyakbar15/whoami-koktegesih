import { describe, it, expect } from "vitest";
import { parsePost, getPostBySlug } from "./blog";

const base = `---
title: Sample Post
date: 2026-01-01
category: writeup
tags: [nmap, recon]
summary: A short summary.
---

Hello world body with a few words here.`;

describe("parsePost", () => {
  it("parses frontmatter fields", () => {
    const post = parsePost(base, "sample");
    expect(post.slug).toBe("sample");
    expect(post.title).toBe("Sample Post");
    expect(post.date).toBe("2026-01-01");
    expect(post.category).toBe("writeup");
    expect(post.tags).toEqual(["nmap", "recon"]);
    expect(post.summary).toBe("A short summary.");
  });

  it("computes a reading time of at least one minute", () => {
    expect(parsePost(base, "s").readingMinutes).toBeGreaterThanOrEqual(1);
  });

  it("falls back to the slug when the title is missing", () => {
    const raw = `---\ndate: 2026-01-01\n---\n\nBody.`;
    expect(parsePost(raw, "fallback-slug").title).toBe("fallback-slug");
  });

  it("defaults an unknown category to article", () => {
    const raw = `---\ntitle: X\ncategory: nonsense\n---\n\nBody.`;
    expect(parsePost(raw, "x").category).toBe("article");
  });

  it("keeps contentId undefined for single-language posts", () => {
    expect(parsePost(base, "s").contentId).toBeUndefined();
  });

  it("splits English and Indonesian on the lang marker", () => {
    const raw = `${base}\n\n<!-- lang:id -->\n\nIsi bahasa Indonesia.`;
    const post = parsePost(raw, "s");
    expect(post.content).not.toContain("Isi bahasa Indonesia");
    expect(post.contentId).toBe("Isi bahasa Indonesia.");
  });

  it("strips standalone HTML comments from rendered content", () => {
    const raw = `---\ntitle: X\n---\n\n<!-- markdownlint-disable MD024 -->\n\nVisible text.`;
    const post = parsePost(raw, "x");
    expect(post.content).not.toContain("markdownlint-disable");
    expect(post.content).toContain("Visible text.");
  });

  it("handles quoted frontmatter values", () => {
    const raw = `---\ntitle: "Quoted: Title"\n---\n\nBody.`;
    expect(parsePost(raw, "x").title).toBe("Quoted: Title");
  });

  it("marks a post as a draft only when draft is true", () => {
    expect(parsePost(base, "s").draft).toBe(false);
    const raw = `---\ntitle: X\ndraft: true\n---\n\nBody.`;
    expect(parsePost(raw, "x").draft).toBe(true);
  });

  it("parses series name and part number", () => {
    const raw = `---\ntitle: X\nseries: OverTheWire Bandit\npart: 2\n---\n\nBody.`;
    const post = parsePost(raw, "x");
    expect(post.series).toBe("OverTheWire Bandit");
    expect(post.part).toBe(2);
  });

  it("leaves series and part undefined when absent", () => {
    const post = parsePost(base, "s");
    expect(post.series).toBeUndefined();
    expect(post.part).toBeUndefined();
  });
});

describe("getPostBySlug", () => {
  it("rejects path traversal attempts", () => {
    expect(getPostBySlug("../../../etc/passwd")).toBeNull();
    expect(getPostBySlug("..%2F..%2Fsecret")).toBeNull();
    expect(getPostBySlug("nested/path")).toBeNull();
  });

  it("returns null for an unknown but well formed slug", () => {
    expect(getPostBySlug("no-such-post")).toBeNull();
  });

  it("loads a real post", () => {
    expect(getPostBySlug("overthewire-bandit")?.series).toBe(
      "OverTheWire Bandit",
    );
  });
});
