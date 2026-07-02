import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://riskyakbar.my.id/sitemap.xml",
    host: "https://riskyakbar.my.id",
  };
}
