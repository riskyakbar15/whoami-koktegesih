import { describe, it, expect } from "vitest";
import { formatDate, escapeXml } from "./format";

describe("formatDate", () => {
  it("formats an ISO date", () => {
    expect(formatDate("2026-01-01")).toBe("Jan 1, 2026");
  });

  it("returns an empty string for empty input", () => {
    expect(formatDate("")).toBe("");
  });

  it("returns the raw value when the date cannot be parsed", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });
});

describe("escapeXml", () => {
  it("escapes all five XML entities", () => {
    expect(escapeXml(`<a href="x">Tom & 'Jerry'</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;Tom &amp; &apos;Jerry&apos;&lt;/a&gt;",
    );
  });

  it("escapes ampersands first so entities are not double escaped", () => {
    expect(escapeXml("a & b < c")).toBe("a &amp; b &lt; c");
  });

  it("leaves plain text untouched", () => {
    expect(escapeXml("Nmap scan notes")).toBe("Nmap scan notes");
  });
});
