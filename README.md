# M. Alexander — Artist Portfolio (Next.js + Notion)

Clean • simple • fast artist website with four tabs: **Home**, **Portfolio**, **About**, **Contact**.  
Content lives in **Notion** (no monthly CMS fees). Deployed on **Vercel Hobby** (free `*.vercel.app` URL).

## Tech Stack

- **Next.js (App Router) + TypeScript + Tailwind CSS**
- **Notion API — @notionhq/client v5** (uses `dataSources.query`)
- Static generation + **ISR** (revalidate ~10 min)

## Features

- Notion-powered content editing (no code needed)
- Fast-loading, mobile-friendly UI
- Accessibility & SEO basics (titles, descriptions, clean HTML)
- Zero monthly costs (domain optional)

---

## Getting Started

### 1) Prerequisites

- Node 18+ (Node 20 recommended)
- A Notion account

### 2) Create a Notion Integration (for `NOTION_TOKEN`)

1. Go to **https://www.notion.so/my-integrations** → **New integration**.
2. Copy the **Internal Integration Secret** (starts with `secret_...`).

### 3) Create Two Notion Databases & Share with the Integration

> In your Teamspace: **New page → Table – Full page**

**A) “Site KV” (key → value settings)**

- Properties:
  - **Name** (Title) — key (e.g., `home_title`)
  - **Value** (Rich text) — value
- Example rows:
  - `home_title` → `M. Alexander`
  - `home_subtitle` → `Painter • Atlanta`
  - `about_bio` → `Short bio text…`
  - `about_headshot_url` → `https://…/headshot.jpg`
  - `contact_email` → `you@example.com`
  - `social_instagram` / `social_twitter` / `social_website`
- **Share → Add connections** → select your integration.

**B) “Works” (portfolio items)**

- Properties:
  - **Name** (Title)
  - **Slug** (Rich text)
  - **Year** (Number)
  - **Role** (Select) — e.g., Oil, Photography, Illustration
  - **Featured** (Checkbox)
  - **Thumbnail** (Files & media)
  - **Images** (Files & media)
  - **Description** (Rich text)
  - **Tags** (Multi-select)
- Add at least one row and tick **Featured**.
- **Share → Add connections** → select your integration.

### 4) Grab IDs

Open each database → **Share → Copy link** → get the **32-char database ID** from the URL.

### 5) Environment Variables

Create `.env.local` in the project root:

```env
NOTION_TOKEN=secret_xxx
NOTION_SITE_KV_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_WORKS_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional (v5): you can supply data source IDs; otherwise the app resolves them from the DB
# NOTION_SITE_KV_DATA_SOURCE_ID=yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
# NOTION_WORKS_DATA_SOURCE_ID=zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz
```

````

### 6) Install & Run
```bash
npm i
npm run dev
# http://localhost:3000
````

You should see your Notion `home_title` / `home_subtitle` and any **Featured** works.

---

## Deploy on Vercel (free)

1. Import the GitHub repo in Vercel.
2. Add the same env vars in **Project → Settings → Environment Variables** (Preview & Production).
3. Deploy → you’ll get `https://<project>.vercel.app`.

---

## Editing Content (Notion Keys)

- Home: `home_title`, `home_subtitle`
- About: `about_bio`, `about_headshot_url`
- Contact: `contact_email`, `social_instagram`, `social_twitter`, `social_website`
- Works DB: toggle **Featured** to show items on Home; everything appears on Portfolio.

---

## Troubleshooting

- **403/unauthorized** → The DB isn’t shared with the integration (Add connections).
- **object_not_found** → Database ID is wrong; copy the 32-char chunk again.
- **Images don’t load** → Ensure `next.config.mjs` allows Notion/asset hosts (remotePatterns). Restart dev.
- **Env changes not picked up** → Restart `npm run dev`.

---

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Lint

---

## Roadmap

- Contact form API (Resend free tier)
- `/portfolio/[slug]` detail pages with OG images
- Richer SEO (sitemap/robots, schema)

---
