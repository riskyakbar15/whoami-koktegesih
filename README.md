# koktegesih - Personal Security Portfolio

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Lighthouse](https://img.shields.io/badge/Lighthouse-100%25-0CCE6B?logo=lighthouse&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Vercel-deployed-black?logo=vercel)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

A personal portfolio with a "classified dossier" theme: a homepage plus a
file-based **Field Notes** blog (`/blog`) for security writeups and lab notes.
Built on the Next.js App Router with React Server Components. "koktegesih" is the
author's handle/codename.

**Live:** [riskyakbar.my.id](https://riskyakbar.my.id)

## Tech stack

- **Next.js 16** (App Router, Turbopack), React Server Components, SSG writeups
- **React 19**
- **Tailwind CSS v4** (CSS-first config via `@theme`, no `tailwind.config.js`)
- **TypeScript 5**
- **react-markdown** + **remark-gfm** for Markdown writeups rendered at build time

## Getting started

Requires **Node.js 20+**.

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

Create a Markdown file in `content/blog/`. The filename becomes the URL slug
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

Commit and push, and the site rebuilds and the new entry appears automatically.
No code changes needed.

## Performance & security

Lighthouse (desktop): **100** Performance · **100** Accessibility · **100** Best
Practices · **100** SEO.

- **Image optimization**: `next/image` with `fetchPriority="high"` on the LCP
  hero and a tuned `quality` for a smaller payload.
- **Leaner bundle**: a modern `browserslist` target drops legacy JS polyfills.
- **Security headers** (set in `next.config.ts`): HSTS, `X-Frame-Options: DENY`,
  `Cross-Origin-Opener-Policy`, `X-Content-Type-Options: nosniff`, and
  `Referrer-Policy`.
- **SEO**: per-route metadata, `Person` JSON-LD, sitemap (incl. writeups),
  `robots.txt`, and an OpenGraph image.

> These features rely on the Next.js runtime on Vercel: the site is **not** a
> static export (`output: 'export'`), which is what enables image optimization
> and response headers.

## Deployment

Deployed on **Vercel** as a Next.js App Router application (React Server
Components + SSG for writeups). Any push to `main` triggers a rebuild.

## License

Code is licensed under the [MIT License](LICENSE).

Written content and writeups (`content/`), along with images and personal
branding, are © Risky Akbar and not covered by the MIT license.
