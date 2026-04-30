# Personal Site Modernization — Master Plan

> **For future sessions:** read this file first. It captures every decision we've made and the phased plan. Pair it with the latest `.claude/handoffs/phase-N.md` to know where execution currently stands.

**Project:** `arthurvasconcelos.github.io` → deployed to `https://arthurvasconcelos.com.br` via GitHub Pages.
**Started:** 2026-04-30 (after ~1 year of neglect; last meaningful commit `f9d8d15` 2025-04-30).
**Owner:** Arthur Vasconcelos (Senior Front-End Engineer at Platform24, Stockholm).

---

## 1. Goals

1. Modernize the existing Nuxt site to current best practices.
2. Set up the foundation for keeping it updated regularly going forward.
3. Add a blog (Arthur wants to start writing dev articles).
4. Trilingual: en-GB / pt-BR / sv.
5. Refresh content (current site says he's at Kognity; he's been at Platform24 since Feb 2026).
6. Establish a coherent visual identity without requiring a designer.

## 2. Source-of-truth references

| Topic | Path |
|---|---|
| Site repo | `/Users/arthurvasconcelos/repos/personal/arthurvasconcelos.github.io` |
| Canonical CV (LaTeX) — drives experience/skills/intro | `/Users/arthurvasconcelos/repos/personal/resume/ArthurVasconcelosCV.tex` |
| GitHub profile README — drives projects list | `/Users/arthurvasconcelos/repos/personal/arthurvasconcelos/README.md` |
| Live site | https://arthurvasconcelos.com.br |
| Domain note | Currently only `.com.br`. Future: may add `.com` and `.se` for domain-per-language. Not in scope yet. |

## 3. Locked decisions (and why)

### Stack & tooling

| Decision | Rationale |
|---|---|
| Stay on Nuxt + Vue + `@nuxt/ui` (compat v4) | Existing structure is fine; refactor is overkill. |
| Migrate `yarn` → `pnpm` | Yarn 1 is unmaintained; pnpm has Nuxt-native happy path and better lockfile stability. |
| Add `@nuxt/eslint` + Prettier | No linter today; need consistent style for ongoing maintenance. |
| Add typecheck CI (GH Actions) | Today only the deploy workflow exists. Type errors should fail PRs. |
| Batch-resolve all 10 open dependabot PRs in one bump | Cleaner than 10 separate merges; Phase 1 sets the new baseline. |

### Internationalization

| Decision | Rationale |
|---|---|
| `@nuxtjs/i18n` with three locales: **en-GB** (default), **pt-BR**, **sv** | Trilingual audience: dev community, Brazilian roots, Swedish residency. |
| URL strategy: `/` (en-GB), `/pt-br/...`, `/sv/...` | Default-no-prefix is cleaner than `/en/...` everywhere. Default = en-GB even though the domain is `.com.br` (acknowledged tradeoff; revisit when `.com` is acquired). |
| Auto-detect via `Accept-Language` on first visit, remember via cookie | Standard nuxt-i18n behavior. |

### Content

| Decision | Rationale |
|---|---|
| Move work experiences, skills, projects out of `.vue` files into typed `app/data/*.ts` | Updates shouldn't require touching components. |
| Skills displayed as **categorized chips** (no % bars) | Modern pattern; self-rated proficiency invites bad-faith debate. |
| Skill categories follow the CV taxonomy: **Languages / Front-end / Back-end / Data & infrastructure / Practices** | Already canonical in his CV; keeps two sources aligned. |
| Work experiences mirror the CV faithfully (9 roles back to 2010) | Single source of truth; site and CV must agree on facts. |
| **Home page copy** = open-source / CLI / Go vibe (flexible self-positioning) | More personal, more interesting; matches his GitHub README framing. |
| **About page copy** = faithful Platform24 / React / healthcare framing | Mirrors current professional reality; this is his "résumé voice." |

### Projects page structure

| Group | Items | Treatment |
|---|---|---|
| **Flagship** | Overseer family: `overseer` (Go CLI) + `overseer-sdk` (Python, PyPI) + `overseer-sdk` (TypeScript, npm) | Single grouped card. SDKs shown as sub-items under Overseer. |
| **Standalone** | `sqlalchemy-seedling` (Python, PyPI) | Its own card. |
| **Legacy / archived** | `vue-izitoast` (npm, 2018), `vue-cbsc` (npm, 2018) | Visually muted section, marked archived. (`vue-cbsc` may be revived as Vue 3 someday — Arthur's call, not in scope.) |
| **Homebrew tap** | `homebrew-tap` repo | **NOT** a project card. Treated as install metadata: brew-distributed projects get a `brew install arthurvasconcelos/tap/<name>` line in their install instructions. Currently only Overseer qualifies. |

### Brand & visual identity

| Decision | Rationale |
|---|---|
| **Typographic identity** (no logo) | Cheap, scalable, doesn't require a designer; the wordmark IS the brand. |
| **Primary color**: Tailwind `violet-500` `#8b5cf6` | Arthur prefers purple; medium violet reads well in light + dark, doesn't feel childish. |
| **Accent color**: Tailwind `emerald-500` `#10b981` | Used sparingly: code highlights, success states, language chip for one of the locales, the typing animation's "server" word. Earns its place semantically rather than being decorative. |
| **Drop** the current `#ff0000` placeholder primary | Was a TODO from Apr 2025. |
| **Retire Slabo 27px** | Heavy newspaper face fighting the rest of the typography. |
| **Headings**: keep Raleway *or* upgrade to Space Grotesk / Geist — TBD in Phase 3 | Arthur to weigh in when we get there. |
| **Mono**: keep Source Code Pro *or* upgrade to Geist Mono / JetBrains Mono — TBD in Phase 3 | Same. |
| **Background**: keep current dark-slate radial gradient | Already a personal-site vibe; cleanup, don't replace. |
| **Reskin typing animation** (currently red/blue/dark/lime mishmash) to violet→emerald palette | Currently fights the brand. |
| **Monogram** for favicon / OG image / avatar: `AV` or `av_` in mono font (underscore reuses the cursor motif) | Ties to the homepage's `_` cursor. |

### Blog (Phase 4)

| Decision | Rationale |
|---|---|
| `@nuxt/content` v3, markdown posts under `content/<lang>/blog/*.md` | Native Nuxt, lightweight, supports drafts + code highlighting. |
| **Hybrid translation policy**: each post has a canonical language; translations are optional and surfaced when present | Realistic to maintain; allows pt-BR-only or en-GB-only posts without forcing triple maintenance. |
| RSS feed per language | Standard expectation; cheap to add. |

### Socials (replacing the current `href="#"` placeholders)

- GitHub: https://github.com/arthurvasconcelos
- LinkedIn: https://www.linkedin.com/in/arthurvasconcelos/
- Stack Overflow: https://stackoverflow.com/users/3130385/arthur-vasconcelos
- npm: https://www.npmjs.com/~arthurvasconcelos *(verify exact handle when wiring)*
- PyPI: https://pypi.org/user/arthurvasconcelos/ *(verify exact handle when wiring)*
- **Email is intentionally omitted.** Contact routes through LinkedIn.

### SEO

- Add `@nuxtjs/sitemap`, JSON-LD `Person` schema, real OG image (use the monogram), canonical URLs, hreflang tags for all 3 locales.
- Replace the placeholder `ogImage: "https://example.com/image.png"` in `app/app.vue:32`.

### Out of scope (deliberately)

- Analytics — none for now. May revisit (Plausible vs GA4) later.
- `.com` / `.se` domain acquisition + multi-domain language routing — Arthur to handle when ready.
- Comments on blog posts — skip for v1.
- Migration to a different framework — sticking with Nuxt.

---

## 4. Phased plan

### Phase 1 — Foundation cleanup

**Acceptance criteria:** dev server boots clean, typecheck passes in CI, no dead code, no placeholders, dependabot queue empty.

- [ ] Migrate `yarn` → `pnpm`. Regenerate lockfile. Update `.github/workflows/deploy.yml` to use pnpm + corepack.
- [ ] Bump deps in one pass — Nuxt latest (3.19+ or 4.x stable if available), Vite 6.4.1+, h3 1.15.5+, devalue 5.6.2+, lodash 4.17.23, lodash-es 4.17.23, qs 6.14.1, tmp 0.2.4, node-forge 1.3.2, @nuxt/devtools 2.7.0. Verify the 10 dependabot branches are obsoleted; close them.
- [ ] Delete dead files: `README2.md`, `Makefile`, `deploy.bat`, `app/components/AppFooter.vue` (unused).
- [ ] Remove `console.log("app.vue:", colorMode)` from `app/app.vue:3`.
- [ ] Remove all commented-out blocks: the `<ClientOnly>` wrappers in `Skill.vue`, `ColorModeButton.vue`, `Me.vue`; the commented `useHead` config in `nuxt.config.ts:39-49`; commented selection block in `app.vue:5-7`.
- [ ] **Properly fix** the `<ClientOnly>` + `@nuxt/icon` hydration bug (root cause, not commenting them out). Current `mode: "css"` in `nuxt.config.ts:21-24` may be related. Restore `<ClientOnly>` wrappers where they belonged (icons, color-mode button) once stable.
- [ ] Replace the `#ff0000` primary in `app/app.config.ts:7` with `violet-500` `#8b5cf6`. Wire `emerald-500` `#10b981` as the accent through @nuxt/ui's color tokens.
- [ ] Replace the placeholder `ogImage: "https://example.com/image.png"` (use a temporary OG image; the final monogram-based one comes in Phase 3).
- [ ] Replace all `href="#"` social links in `app/components/about/Me.vue:7-20` with the real URLs from §3 above. Add Stack Overflow and PyPI.
- [ ] Add `@nuxt/eslint` + Prettier; commit a sensible default config. Run once to fix existing violations.
- [ ] Add a `.github/workflows/check.yml` that runs `pnpm install`, `pnpm lint`, and `pnpm typecheck` on PRs and pushes to main.
- [ ] Update `README.md`: drop the boilerplate, replace `README2.md` content was the Nuxt starter — remove. Add a real project description and contributing-to-myself notes.
- [ ] Verify dev server boots clean: `pnpm dev` → no console errors, light/dark toggle works, all pages render.
- [ ] Write `.claude/handoffs/phase-1.md`.

### Phase 2 — Content as data + i18n scaffolding

**Acceptance criteria:** all visible copy is translated to en-GB/pt-BR/sv; experiences/skills/projects are loaded from typed data files; locale switcher works.

- [ ] Install + configure `@nuxtjs/i18n` with en-GB (default, no prefix), pt-BR, sv. Cookie-based persistence + `Accept-Language` detection.
- [ ] Create `app/data/work-experiences.ts` — port the 9 roles from the CV with full details (titles, dates, location, locationType, description, keywords). Preserve the existing `useWorkExperience` composable shape.
- [ ] Create `app/data/skills.ts` — categorized list using the CV taxonomy.
- [ ] Create `app/data/projects.ts` — Overseer family + sqlalchemy-seedling + legacy section.
- [ ] Migrate `WorkExperiences.vue`, `Skills.vue`, `projects.vue` to consume the data files.
- [ ] Translate all visible UI strings (nav items, headings, hero copy, about copy) into the three locales using i18n message catalogs.
- [ ] Add a locale switcher to `AppHeader.vue`.
- [ ] Write `.claude/handoffs/phase-2.md`.

### Phase 3 — Surface modernization (skills + brand + SEO)

**Acceptance criteria:** the site looks intentional in 2026; skills render as chips; SEO score is solid; reduced-motion is honored.

- [ ] Replace skill % bars with categorized chips. Delete the `level` field from skills data and the `<UProgress>` from `Skill.vue`. Build a chip component using `@nuxt/ui`.
- [ ] Reskin the typing animation in `app/pages/index.vue` to use the violet→emerald palette consistently. Drop the per-language color blocks (red/yellow/blue) — they fight the brand.
- [ ] Honor `prefers-reduced-motion`: disable the typing animation when set, fall back to static text.
- [ ] Decide and apply final font choices (Raleway vs Space Grotesk vs Geist; Source Code Pro vs Geist Mono vs JetBrains Mono). Trim weights aggressively.
- [ ] Build the final curated Projects page UI: flagship Overseer card with sub-items for SDKs, standalone card for sqlalchemy-seedling, muted Legacy section. Keep the live GH/npm/PyPI fetch for stars/version where it adds value.
- [ ] Generate the monogram (`av_` in mono): SVG for favicon, PNG variants for OG image and apple-touch-icon. Replace `public/favicon.ico`.
- [ ] Add `@nuxtjs/sitemap`. Add JSON-LD `Person` schema in `app/app.vue` head config.
- [ ] Add proper hreflang tags for all 3 locales.
- [ ] Replace temporary OG image with the final monogram-based one.
- [ ] Write `.claude/handoffs/phase-3.md`.

### Phase 4 — Blog

**Acceptance criteria:** Arthur can write a markdown file in `content/<lang>/blog/`, push it, and have it appear on the site with code highlighting, RSS, and (optional) translations linked.

- [ ] Install + configure `@nuxt/content` v3.
- [ ] Set up `content/en-gb/blog/`, `content/pt-br/blog/`, `content/sv/blog/`.
- [ ] Build `/blog` (list) and `/blog/[slug]` (post) pages, locale-aware.
- [ ] Implement the hybrid translation surface: when on a post that has translations available, show a "Also available in: PT-BR / SV" link.
- [ ] Add code syntax highlighting (Shiki). Decide a theme that pairs with violet/emerald.
- [ ] Add RSS feed per language at `/rss.xml`, `/pt-br/rss.xml`, `/sv/rss.xml`.
- [ ] Add reading time estimate.
- [ ] Add draft support (drafts not generated in production builds).
- [ ] Wire a "Blog" link into the main nav.
- [ ] Write a "Hello world" post in en-GB to seed and validate the pipeline.
- [ ] Write `.claude/handoffs/phase-4.md`.

---

## 5. How sessions hand off

**Convention:** the phase isn't done until its handoff doc is written and committed. Treat it as a non-skippable acceptance criterion.

**Handoff doc structure** (`.claude/handoffs/phase-N.md`):

```markdown
# Phase N Handoff — <Title>

## Done
- Bullet list with file paths or commit refs.

## Current state
- Versions, architecture decisions, anything not obvious from `git log`.

## How to verify
- Concrete commands and expected outputs.

## Open / deferred
- What we knowingly skipped + reason.

## Phase N+1 — refined plan
- Copy of next phase from PLAN.md, adjusted for what we learned.
- "Read these files first" list.
```

**Starting a fresh session:**

> Continue the personal-site modernization. Read `.claude/PLAN.md` and the most recent `.claude/handoffs/phase-N.md`, then pick up where we left off.

That's all the new session needs.

---

## 6. Open items requiring Arthur's input later

These are deliberately deferred; don't try to resolve them mid-implementation without asking.

- **Phase 3 typography**: Raleway vs Space Grotesk vs Geist? Source Code Pro vs Geist Mono vs JetBrains Mono?
- **Phase 4 blog**: which Shiki theme to pair with violet/emerald?
- **Phase 4 first post**: topic for the "Hello world" seeding post — likely something about modernizing this very site, but his call.
- **Phase 1 archive flags**: confirm npm `vue-izitoast` and `vue-cbsc` should be marked deprecated/archived on his side too. Out of scope for site code, but worth raising once Phase 3 lands.
