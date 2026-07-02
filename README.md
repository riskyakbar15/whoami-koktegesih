# koktegesih — Personal Security Portfolio

A single-page personal portfolio with a "classified dossier" theme, plus a
file-based **Field Notes** section for security writeups and lab notes. Built as
a fully static site with the App Router.

**Live:** [https://riskyakbar.my.id]

## Tech stack

- **Next.js 16** (App Router, Turbopack) — static export, RSC
- **React 19**
- **Tailwind CSS v4** (CSS-first config via `@theme`, no `tailwind.config.js`)
- **TypeScript 5**
- **react-markdown** + **remark-gfm** — Markdown writeups rendered at build time

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## Project structure

```project structure
app/
  layout.tsx            # metadata, JSON-LD, global shell
  page.tsx              # homepage sections
  globals.css           # theme tokens + prose styles
  components/           # UI sections (Hero, About, Projects, Timeline, ...)
  blog/
    page.tsx            # writeup index (/blog)
    [slug]/page.tsx     # single writeup (SSG)
  data/portfolio.ts     # profile, skills, projects, timeline, certificates
  sitemap.ts, robots.ts, opengraph-image.tsx, icon.png
content/
  blog/*.md             # writeups (Markdown + frontmatter)
lib/
  blog.ts               # reads content/blog at build time
  format.ts             # date formatting
public/                 # images (hero, badges, certificates)
```

## Adding a writeup

Create a Markdown file in `content/blog/` — the filename becomes the URL slug
(`content/blog/my-post.md` → `/blog/my-post`):

```markdown
---
title: My Writeup Title
date: 2026-07-02
category: writeup # writeup | tutorial | notes | article
tags: [nmap, recon]
summary: One-line summary shown on the index card.
---

## Your content here
```

Commit and push — the site rebuilds and the new entry appears automatically.
No code changes needed.

## Deployment

Deployed as a static site on Vercel. Any push to `main` triggers a rebuild.

## License

Personal project. Content and writeups © Risky Akbar. Code provided as-is.
