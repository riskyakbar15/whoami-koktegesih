import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import CommandPalette, { type PaletteItem } from "./components/CommandPalette";
import { getAllPosts } from "@/lib/blog";
import { profile, socials } from "./data/portfolio";

const SITE_URL = "https://riskyakbar.my.id";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Risky Akbar - Cyber Security Portfolio",
    template: "%s · Risky Akbar",
  },
  description:
    "Classified dossier of Risky Akbar (koktegesih), an informatics student concentrating in cyber security. Skills, case files, certifications, and secure contact.",
  keywords: [
    "Risky Akbar",
    "koktegesih",
    "cyber security",
    "portfolio",
    "informatics",
    "penetration testing",
    "CTF",
    "SOC",
    "ethical hacking",
  ],
  authors: [{ name: "Risky Akbar", url: SITE_URL }],
  creator: "Risky Akbar",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Risky Akbar - Cyber Security Portfolio",
    title: "Risky Akbar - Cyber Security Portfolio",
    description:
      "Classified dossier of an informatics student concentrating in cyber security.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Risky Akbar - Cyber Security Portfolio",
    description:
      "Classified dossier of an informatics student concentrating in cyber security.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0e1116",
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: profile.codename,
  jobTitle: "Cyber Security Student",
  url: SITE_URL,
  sameAs: socials
    .filter((s) => s.href.startsWith("https://"))
    .map((s) => s.href),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const paletteItems: PaletteItem[] = [
    { label: "Subject", href: "/#subject", group: "section" },
    { label: "Profile", href: "/#profile", group: "section" },
    { label: "Capabilities", href: "/#capabilities", group: "section" },
    { label: "Case Files", href: "/#case-files", group: "section" },
    { label: "Certifications", href: "/#certifications", group: "section" },
    { label: "Experience", href: "/#track-record", group: "section" },
    { label: "Contact", href: "/#contact", group: "section" },
    { label: "Field Notes", href: "/blog", group: "page" },
    { label: "Uses", href: "/uses", group: "page" },
    ...getAllPosts().map((post) => ({
      label: post.title,
      href: `/blog/${post.slug}`,
      group: post.category,
    })),
  ];

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <noscript>
          <style>{`.redacted{color:inherit!important}.redacted::after{display:none!important}.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#main"
          className="sr-only rounded-sm font-mono text-xs focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:border focus:border-accent focus:bg-ink focus:px-4 focus:py-3 focus:text-accent"
        >
          Skip to content
        </a>
        {children}
        <CommandPalette items={paletteItems} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
