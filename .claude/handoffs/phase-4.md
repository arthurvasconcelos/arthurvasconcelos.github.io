# Phase 4 Handoff — Blog

## Done

- **`@nuxt/content` v3 (3.13.0) installed**: `better-sqlite3` added as direct dep (required by the module's SQLite backend). `better-sqlite3` added to `pnpm.onlyBuiltDependencies` so its native bindings build on install.
- **`tailwindcss` added as direct dev dep**: The `@import "tailwindcss"` in `app/assets/css/main.css` requires `tailwindcss` to be resolvable from the project root. Without it as a direct dep, pnpm's strict isolation prevented resolution and caused 500s on all SSR pages. Fixed by adding `tailwindcss@4.2.4` to `devDependencies`.
- **`package.json` `imports` field added**: `@nuxt/content` v3 generates server code that imports from `#content/server` (a Nuxt virtual module alias). This import needs to be declared in `package.json`'s `imports` field for Node.js ESM to resolve it. Added `"#content/server": "./node_modules/@nuxt/content/dist/runtime/nitro.js"`.
- **`content.config.ts` created**: Defines `blog` collection with `type: 'page'`, source `**/*.md`, schema: `title`, `description`, `date` (coerced), `draft` (bool, default false), `translationKey` (optional string).
- **Shiki code highlighting**: Tokyo Night (dark) / GitHub Light (light) dual theme configured in `nuxt.config.ts` → `content.highlight`. Shiki dark CSS variables wired in `app/assets/css/main.css` under `html.dark .shiki`.
- **Content directories**: `content/en-gb/blog/`, `content/pt-br/blog/`, `content/sv/blog/` created. `pt-br` and `sv` have `.gitkeep` (no posts yet).
- **Blog list page** (`app/pages/blog/index.vue`): Locale-aware; queries `queryCollection('blog')` filtered by path prefix `/<localeDir>/blog/%` and `!draft`. Shows post title, date, description in `UCard` components.
- **Blog post page** (`app/pages/blog/[slug].vue`): Locale-aware; fetches post by exact path. Throws 404 if not found. Shows title, date, reading time (calculated by traversing body AST at 200 wpm), draft badge (for dev), "Also available in:" links (from `translationKey` matches across locales), full content via `<ContentRenderer>` in `prose prose-slate dark:prose-invert` wrapper.
- **RSS feeds**: Three server routes — `server/routes/rss.xml.ts` (en-GB), `server/routes/pt-br/rss.xml.ts`, `server/routes/sv/rss.xml.ts`. Each queries the blog collection for its locale and generates RSS 2.0 XML. Import uses `@nuxt/content/server` (NOT `#content/server`). RSS routes added to `nitro.prerender.routes` in `nuxt.config.ts` so they're included in `nuxt generate` output.
- **i18n**: `nav.blog` and `blog.*` keys added to all three locale files (en-GB, pt-BR, sv). Swedish nav label is "Blogg".
- **Header**: Blog nav item added to `AppHeader.vue`.
- **First post**: `content/en-gb/blog/rebuilding-my-portfolio-after-a-year.md` — a genuine ~800-word retrospective on the 2026 site rebuild. `translationKey` set for future translations.

## Current state

- **Blog at `/blog`**: Lists en-GB posts. `/pt-br/blog` and `/sv/blog` show empty state (no posts yet).
- **Post at `/blog/[slug]`**: Renders with reading time, back link, and optional "Also available in" section (hidden until `translationKey` matches exist in other locales).
- **RSS at `/rss.xml`**: Returns valid RSS 2.0 XML with current en-GB posts. `/pt-br/rss.xml` and `/sv/rss.xml` return valid empty feeds.
- **Draft posts**: Filtered out in list queries (`!p.draft`). Not linked → not prerendered in `nuxt generate` output → effectively hidden in production.
- **Translation surface**: When a post has `translationKey: "some-key"` and another locale has a post with the same key, "Also available in:" links appear on the post page.

## How to verify

```bash
pnpm install           # builds better-sqlite3 native bindings
pnpm dev               # boots at http://localhost:3000
pnpm lint              # exits 0
```

Check manually:
- `/blog` — shows "Rebuilding My Portfolio After a Year of Neglect" card
- `/blog/rebuilding-my-portfolio-after-a-year` — renders full post, shows reading time, "Back to blog" link
- `/pt-br/blog` — shows "Nenhum post por enquanto." empty state
- `/sv/blog` — shows "Inga inlägg ännu." empty state
- `/rss.xml` — valid RSS with the first post
- Header nav: shows Home / About / Projects / Blog
- Switch locale: sv nav shows "Blogg", pt-BR shows "Blog"
- 404: `/blog/anything-that-doesnt-exist` → Nuxt error page

## Open / deferred

- **pt-BR and sv translations of first post**: The first post (`rebuilding-my-portfolio-after-a-year`) only exists in en-GB. Portuguese and Swedish translations are Arthur's to write. Once written, set the same `translationKey: "rebuilding-my-portfolio-after-a-year"` in the frontmatter and the "Also available in" links will appear automatically.
- **`prose` styles**: The `<ContentRenderer>` is wrapped in `prose prose-slate dark:prose-invert`. This requires `@tailwindcss/typography` to produce styled prose. Verify on the post page that headings, paragraphs, blockquotes, and code blocks render as expected. `@nuxt/ui` includes typography styles, but if prose appearance needs adjustment, add `@tailwindcss/typography` explicitly.
- **RSS: `<link>` in HTML head**: RSS feeds are accessible at `/rss.xml` etc., but there are no `<link rel="alternate" type="application/rss+xml">` meta tags in the page head. These help feed readers auto-discover feeds. Worth adding to `app/app.vue` or the blog page head.
- **Sitemap + blog posts**: `@nuxtjs/sitemap` should auto-discover blog post routes if it crawls links. Verify on deploy that `/sitemap.xml` includes blog post URLs.
- **`#content/server` alias**: Added manually to `package.json` `imports`. This should ideally be handled by the `@nuxt/content` module itself (likely a bug in v3.13.0). If a future version of `@nuxt/content` adds it automatically, the manual entry can be removed.
- **`tailwindcss` direct dep**: Added because pnpm's strict node_modules isolation prevents transitive dep resolution in CSS preprocessing. Also likely pre-existing issue from Phase 3 (the site may have been tested in a different environment). This is the correct fix.
