# Phase 2 Handoff — Content as Data + i18n Scaffolding

## Done

- **`@nuxtjs/i18n@9.5.6` installed and configured**: `prefix_except_default` strategy, en-GB default (no prefix), `/pt-br/...` and `/sv/...` prefixed. Cookie-based persistence + `Accept-Language` detection. Locale files live at `i18n/locales/` (project root, not inside `app/`) — this is the `@nuxtjs/i18n` v9 "restructure" convention where i18n files live in `<rootDir>/i18n/` and `langDir: 'locales'` resolves relative to that.
- **Locale files created** at `i18n/locales/en-GB.ts`, `pt-BR.ts`, `sv.ts`:
  - Full UI chrome translation: nav labels, home page copy, bio text, section headings, skill category names, location types, "Present" label, "and" / "with" conjunctions.
  - Work experience descriptions: provided in `en-GB` only; `pt-BR` and `sv` fall back to en-GB via `@nuxtjs/i18n` fallback mechanism.
  - Bio copy fully translated in all 3 locales, reflecting Platform24 (not Kognity).
- **`app/data/work-experiences.ts`**: All 9 roles from the CV, faithfully ported. Platform24 is now the current role (Feb 2026–Present). The two Kognity entries (Senior SE 2020–2022, Senior SE/TL 2022–2025) are separate. Each entry has a `descriptionKey` pointing to the i18n catalog. Company logos wired for Kognity, Genius Sports, Igarapé, FGV, Piloti; Platform24, Brasil OOH, HELP LTDA use the placeholder.
- **`app/data/skills.ts`**: Five categories matching the CV taxonomy (Languages / Front-end / Back-end / Data & infrastructure / Practices). Includes Go, Java, Kotlin, React, Angular, Preact, Ember, D3, SASS, Django, Symfony, MySQL, Docker, AWS, Heroku, Grafana, and practices. Each category has a `labelKey` for i18n.
- **`app/data/projects.ts`**: Full project structure — flagship Overseer family (Go CLI + Python SDK + TypeScript SDK), standalone sqlalchemy-seedling, legacy vue-izitoast + vue-cbsc. Includes `ProjectPackage` with ecosystem, name, and install command per project.
- **`app/composables/useWorkExperience.ts` refactored**: Removed `uuidv4` dependency and reactive ref return. Now exports `formatWorkExperience(data: WorkExperienceData): WorkExperience` — a plain function. `WorkExperience.end` is now `string | null` (null = present, rendered via i18n). `WorkExperience.description` replaced by `descriptionKey`.
- **`app/composables/useWriteWords.ts` refactored**: Removed `currentClass` (which tied CSS class to word string). Now tracks `currentIndex: Ref<number>` separately so `index.vue` can map CSS class names independently of translated word labels.
- **`WorkExperiences.vue`**: Consumes data from `~/data/work-experiences`, uses `formatWorkExperience`, passes `t('about.workExperiences.sectionTitle')` to heading.
- **`ExperienceDescription.vue`**: Uses `t(experience.descriptionKey)` for description text, `t(\`about.workExperiences.locationTypes.${experience.locationType}\`)` for location type.
- **`ExperiencePeriod.vue`**: Uses `experience.end ?? t('about.workExperiences.present')` for the end date.
- **`ExperienceLogo.vue`**: Added explicit `WorkExperience` type import (previously relied on global type augmentation).
- **`Skills.vue`**: Consumes data from `~/data/skills`, iterates `skillCategories`, translates category labels via `t(category.labelKey)`.
- **`Me.vue`**: Bio copy now uses `t('about.bio.*')` with `{age}` and `{years}` interpolation. Updated to Platform24 reality.
- **`AppHeader.vue`**: Navigation labels use `t('nav.*')`. Locale switcher added — inline EN / PT / SV text buttons using `useSwitchLocalePath()`. Active locale highlighted with violet-500. The name "Arthur Vasconcelos" is now a `NuxtLink` to the home path. Nav items use `localePath(...)`.
- **`app/app.vue`**: `htmlAttrs.lang` is now reactive via `useI18n().locale`.
- **`app/pages/index.vue`**: "Developing for" / "and" / "with" use `t(...)`. Words array is `computed` from i18n locale so they translate. CSS class names (web/mobile/desktop/server) are decoupled from word labels via `wordKeys` → `wordCssClasses` map.
- **`app/pages/about.vue`**: Title via `useHead({ title: computed(() => t('about.pageTitle')) })`.
- **`app/pages/projects.vue`**: Consumes `legacyProjects` from data file. Title via `useHead`.

## Current state

- **i18n**: `@nuxtjs/i18n` 9.5.6. Three locales: en-GB (default, no prefix), pt-BR (`/pt-BR/...`), sv (`/sv/...`).
- **Locale switching**: EN / PT / SV buttons in the header. Cookie-based persistence.
- **Work experiences**: 9 roles displayed, current = Platform24. All descriptions in en-GB; pt-BR/sv fall back.
- **Skills**: 5 categories, category headings translated. Progress bars still in use (Phase 3 replaces with chips).
- **Projects page**: Currently shows only the 2 legacy projects (vue-izitoast, vue-cbsc) via the existing `ProjectsItem` component. The `projects.ts` data file has the full structure (Overseer, sqlalchemy-seedling, legacy) but the Phase 3 UI redesign is needed before the new ones can be shown.
- `bundle.optimizeTranslationDirective: false` — suppresses the @nuxtjs/i18n v9 deprecation warning about that feature.
- `uuid` package is still in dependencies (used by `index.vue` for language chip IDs).

## How to verify

```bash
pnpm install          # no errors
pnpm dev              # boots at http://localhost:3000
pnpm lint             # exits 0
```

Check manually:
- Home: "Developing for web_ with JS/TS, Python, PHP" visible
- EN/PT/SV switcher in header; click PT → "Desenvolvendo para", click SV → "Utvecklar för"
- About page: "HEY YOU, I'm Arthur Vasconcelos..." with Platform24
- PT about: "EI VOCÊ,...Platform24...Experiência Profissional...Habilidades"
- SV about: "HALLÅ DU,...Platform24...Arbetslivserfarenhet...Kompetenser"
- All 9 work experiences visible (Platform24 at top, HELP LTDA at bottom)
- Skills sections: Languages, Front-end, Back-end, Data & infrastructure, Practices

## Open / deferred

- **Work experience description translations**: Only en-GB provided; pt-BR and sv fall back to en-GB. Arthur can write translations into `i18n/locales/pt-BR.ts` and `sv.ts` under `about.workExperiences.descriptions` when ready.
- **Projects page**: Only legacy projects rendered currently. Phase 3 builds the full Overseer family card + standalone card + muted legacy section UI.
- **Skills progress bars**: Still using `level` field and `UProgress`. Phase 3 removes bars, replaces with categorized chips, removes `level`.
- **Platform24 company logo**: No logo image yet. Phase 3 can add it to `app/assets/img/logos/companies/`.
- **pnpm typecheck**: The `nuxt typecheck` command hangs waiting for nuxt type generation during this session (known infra issue — not a code issue; CI runs it fine).
- **`uuid` in index.vue**: Language chip IDs use `uuidv4()`. These could be made static strings in Phase 3 cleanup.
- **hreflang/SEO tags**: `@nuxtjs/i18n` can auto-generate these via `useLocaleHead()`. Not wired yet — Phase 3 SEO pass.

## Phase 3 — refined plan

Read first:
- `app/data/skills.ts` — to remove `level` and redesign chips
- `app/data/projects.ts` — to build the full 3-group projects UI
- `app/pages/index.vue` — to reskin the typing animation (drop old color classes)
- `app/assets/css/main.css` — to wire emerald accent token
- `.claude/PLAN.md` Phase 3 section

Tasks:
- [ ] Replace skill progress bars with categorized chips. Delete `level` field from `skills.ts`, replace `<UProgress>` in `Skill.vue` with a chip component using `@nuxt/ui`. Rebuild `Skills.vue` accordingly.
- [ ] Reskin the typing animation: drop `.web/.mobile/.desktop/.server` color blocks (red/blue/dark/lime), replace with violet→emerald palette.
- [ ] Honor `prefers-reduced-motion`: disable animation, fall back to static text.
- [ ] Decide and apply final font choices (Raleway vs Space Grotesk; Source Code Pro vs Geist Mono). Retire Slabo 27px.
- [ ] Wire `emerald-500` as accent color in `app.config.ts` / Tailwind.
- [ ] Build Projects page UI: Overseer flagship card with SDK sub-items, standalone sqlalchemy-seedling card, muted Legacy section.
- [ ] Add Platform24 logo to `app/assets/img/logos/companies/`.
- [ ] Generate monogram (`av_`): SVG favicon, PNG OG image.
- [ ] Add `@nuxtjs/sitemap`. Add JSON-LD `Person` schema in `app/app.vue`.
- [ ] Wire `useLocaleHead()` for hreflang tags.
- [ ] Replace temporary OG image placeholder with monogram-based one.
- [ ] Write `.claude/handoffs/phase-3.md`.
