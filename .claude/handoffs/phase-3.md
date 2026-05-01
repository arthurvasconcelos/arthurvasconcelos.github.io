# Phase 3 Handoff — Surface Modernization

## Done

- **Fonts replaced**: Raleway → Space Grotesk, Slabo 27px → removed (body text inherits Space Grotesk from `html` rule), Source Code Pro → JetBrains Mono. Weights: Space Grotesk 400/600/700, JetBrains Mono 400/700. All old `font-raleway`, `font-slabo`, `font-source` class references replaced across all components.
- **Skills: progress bars → chips**: Removed `level` field from `Skill` type and all `skillCategories` data. `app/components/about/Skill.vue` now renders a `UBadge` (primary/subtle) with icon + name. `SkillsContainer.vue` changed from 3-col grid to `flex flex-wrap gap-2`.
- **Typing animation reskin**: Dropped `.web/.mobile/.desktop/.server` color blocks (red/blue/dark/lime). Word highlight is now a single `word-highlight` class (`bg-violet-500 text-white`). Language badges (JS/TS, Python, PHP) are a single `lang-badge` class (emerald tint, adapts dark/light). Static language IDs replace `uuidv4()` calls; `uuid` package removed from dependencies.
- **`prefers-reduced-motion`**: `usePreferredReducedMotion()` from VueUse stops `wordsInterval()` from starting. Cursor blink animation suppressed via `@media (prefers-reduced-motion: reduce)`.
- **Emerald accent wired**: `app/app.config.ts` now has `secondary: "emerald"` alongside `primary: "violet"`.
- **Projects page redesigned**: Three sections — Featured Projects (flagship, Overseer with SDKs), Libraries (standalone, sqlalchemy-seedling), Legacy & Archived (muted, existing `Item.vue`). New `app/components/projects/Card.vue` handles flagship + standalone: fetches GitHub stats, shows install command, renders SDK sub-cards for projects with `sdks`. Legacy section uses `opacity-70` for visual muting.
- **i18n: `projects.sections` keys added** to all three locales (`en-GB`, `pt-BR`, `sv`).
- **Monogram favicon**: `public/favicon.svg` — violet rounded-square with `av_` in JetBrains Mono. Referenced as `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` in `app/app.vue`.
- **OG image**: `public/og-image.svg` — dark-slate background, violet accent bar, `av_` watermark, name/title/domain. `og:image` meta now points to `/og-image.svg`.
- **SEO — hreflang**: `useLocaleHead({ addSeoAttributes: true })` wired in `app/app.vue`, which auto-generates `<link rel="alternate" hreflang="...">` tags and reactive `lang` attribute for all 3 locales.
- **SEO — JSON-LD `Person` schema**: Added in `app/app.vue` via `useHead` `script` array. Includes `jobTitle`, `url`, `sameAs` (GitHub, LinkedIn, Stack Overflow), Stockholm address.
- **`@nuxtjs/sitemap` installed and registered**: `nuxt.config.ts` now lists `"@nuxtjs/sitemap"` in modules. `site.url` and `site.name` set for absolute sitemap URLs. Sitemap auto-discovers routes including i18n locale prefixes — accessible at `/sitemap.xml` after deploy.
- **`nuxt.config.ts` `site` key**: `{ url: "https://arthurvasconcelos.com.br", name: "Arthur Vasconcelos" }` — used by both sitemap and hreflang.

## Current state

- **Fonts**: Space Grotesk (global default via `html { font-family: var(--font-space-grotesk) }`), JetBrains Mono for code/highlight/mono contexts (`font-jetbrains` class).
- **Skills**: 29 skills across 5 categories, displayed as violet chip badges — no proficiency levels shown.
- **Home page**: Violet word highlight, emerald language badges, reduced-motion safe.
- **Projects**: Three sections, `ProjectsCard` (new) for flagship/standalone, `ProjectsItem` (legacy) for archived projects.
- **Sitemap**: Auto-generated at `/sitemap.xml` from Nuxt routes + i18n locale prefixes.
- **OG image**: SVG at `/og-image.svg`. Works for most platforms; Twitter/X does not support SVG — see Open/deferred.
- **Favicon**: SVG at `/favicon.svg`. Falls back to system favicon on very old browsers (no `.ico` kept).

## How to verify

```bash
pnpm install
pnpm dev              # boots at http://localhost:3000
pnpm lint             # exits 0
```

Check manually:
- Home: violet chip for cycling word (web/mobile/desktop/server), emerald badges for JS/TS / Python / PHP
- About → Skills: chip grid per category, no progress bars
- Projects: "Featured Projects" (Overseer + SDK sub-cards), "Libraries" (sqlalchemy-seedling), "Legacy & Archived" (muted vue-izitoast, vue-cbsc)
- Header: Space Grotesk name, JetBrains Mono `\n` + locale switcher
- `view-source`: `<html lang="en-GB">`, hreflang link tags, JSON-LD script, favicon SVG link
- `/sitemap.xml`: valid sitemap with all 3 locale variants of each route
- Switch to PT: `projects.sections.flagship` = "Projetos em Destaque"
- Enable OS reduced-motion: cursor stops blinking, word animation doesn't start

## Open / deferred

- **OG image PNG**: `public/og-image.svg` is an SVG. Twitter/X requires raster PNG for og:image. Recommend exporting `og-image.svg` to a 1200×630 PNG (e.g. with `sharp` or any SVG-to-PNG tool) and updating the `ogImage` meta. The design is ready; only the format conversion is needed.
- **Platform24 logo**: No logo asset for `app/assets/img/logos/companies/`. `ExperienceLogo.vue` falls back to `PlaceholderBox` for Platform24. Add the actual logo when available.
- **Work experience description translations**: Only en-GB provided; pt-BR/sv fall back. Translations can be written in `i18n/locales/pt-BR.ts` and `sv.ts` under `about.workExperiences.descriptions` when ready.
- **`@nuxtjs/i18n` + sitemap locale detection**: Verify on deploy that `/sitemap.xml` correctly lists `/`, `/pt-br/`, `/sv/` variants. The module should handle this automatically given the i18n config, but worth confirming on the live URL.
- **`uuid` in `node_modules`**: `uuid` was removed from `dependencies`. Other packages may still have it as a transitive dep — that's fine.

## Phase 4 — refined plan

Read first:
- `.claude/PLAN.md` Phase 4 section
- `nuxt.config.ts` — to add `@nuxt/content`
- `app/app.vue` — to wire blog nav

Tasks:
- [ ] Install + configure `@nuxt/content` v3.
- [ ] Create `content/en-gb/blog/`, `content/pt-br/blog/`, `content/sv/blog/`.
- [ ] Build `/blog` (list) and `/blog/[slug]` (post) pages, locale-aware.
- [ ] Implement hybrid translation surface: when a post has translations, show "Also available in: PT-BR / SV" link.
- [ ] Add code syntax highlighting (Shiki). Decide a theme that pairs with violet/emerald.
- [ ] Add RSS feed per language at `/rss.xml`, `/pt-br/rss.xml`, `/sv/rss.xml`.
- [ ] Add reading time estimate.
- [ ] Add draft support (drafts not generated in production builds).
- [ ] Wire a "Blog" link into `AppHeader.vue` nav.
- [ ] Write a "Hello world" post in en-GB to seed and validate the pipeline.
- [ ] Write `.claude/handoffs/phase-4.md`.
