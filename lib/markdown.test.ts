import { describe, it, expect } from "vitest";
import { slugify, extractHeadings } from "./markdown";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Initial Recon Steps")).toBe("initial-recon-steps");
  });

  it("collapses punctuation runs into a single hyphen", () => {
    expect(slugify("TLS / SRTP: why?")).toBe("tls-srtp-why");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  --Setup--  ")).toBe("setup");
  });
});

describe("extractHeadings", () => {
  it("returns top-level headings with ids", () => {
    const md = "## First Step\n\ntext\n\n## Second Step\n";
    expect(extractHeadings(md)).toEqual([
      { id: "first-step", text: "First Step" },
      { id: "second-step", text: "Second Step" },
    ]);
  });

  it("ignores headings inside fenced code blocks", () => {
    const md = "## Real\n\n```bash\n## not a heading\n```\n";
    expect(extractHeadings(md)).toEqual([{ id: "real", text: "Real" }]);
  });

  it("ignores h3 and deeper", () => {
    expect(extractHeadings("### Sub\n#### Deeper\n")).toEqual([]);
  });

  it("strips inline markdown from heading text", () => {
    expect(extractHeadings("## Use `nmap` *now*\n")).toEqual([
      { id: "use-nmap-now", text: "Use nmap now" },
    ]);
  });
});
