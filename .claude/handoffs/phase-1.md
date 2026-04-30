# Phase 1 Handoff — Foundation Cleanup

## Done

- **yarn → pnpm migration**: Deleted `yarn.lock`, added `pnpm-lock.yaml`, set `"packageManager": "pnpm@10.10.0"` in `package.json`. Added `pnpm.onlyBuiltDependencies` for native build deps (`@parcel/watcher`, `esbuild`, `unrs-resolver`, `vue-demi`). Updated `.github/workflows/deploy.yml` to use `pnpm/action-setup@v4`.
- **Dep bump**: `pnpm install` resolved `nuxt` to `3.21.4` (was `3.17.3`), `vue` to `3.5.33`, `@nuxt/ui` to `3.3.7`, `@vueuse/nuxt` to `13.9.0`. All transitive security deps (vite, h3, devalue, qs, etc.) are resolved by the new lockfile.
- **Dead files deleted**: `README2.md`, `Makefile`, `deploy.bat`, `app/components/AppFooter.vue`.
- **Console log removed**: `console.log("app.vue:", colorMode)` and the unused `const colorMode = useColorMode()` removed from `app/app.vue`.
- **Commented blocks cleaned**: Removed all commented-out blocks from `app/app.vue`, `nuxt.config.ts`, `app/layouts/default.vue`, `app/components/ColorModeButton.vue`, `app/components/about/Skill.vue`, `app/components/about/Me.vue`. Also removed placeholder `runtimeConfig` from `nuxt.config.ts`.
- **ClientOnly hydration bug fixed**: `app/components/ColorModeButton.vue` now properly wraps the button in `<ClientOnly>` with a loading spinner fallback — this was the right fix since the button's icon depends on client-side `colorMode.value`. `Skill.vue` does NOT need `<ClientOnly>` because `icon.mode: "css"` in `nuxt.config.ts` eliminates SSR icon hydration mismatches.
- **Primary color**: `app/app.config.ts` now sets `ui.colors.primary: "violet"` (previously `theme.colors.primary: "#ff0000"`). The correct `@nuxt/ui` v3 `AppConfigUI` type uses `ui.colors` as `Record<string, Color>`.
- **OG image placeholder replaced**: Removed `ogImage: "https://example.com/image.png"`, changed `twitterCard` to `"summary"`. Final OG image is Phase 3 scope.
- **Real social links**: `app/components/about/Me.vue` now has real URLs for GitHub, LinkedIn, Stack Overflow, NPM, PyPI. Removed the two commented test icons.
- **@nuxt/eslint + Prettier added**: `@nuxt/eslint@1.15.2` added to modules and devDependencies. `prettier@3.8.3` + `prettier-plugin-tailwindcss@0.6.14` added. `eslint.config.mjs` uses `withNuxt()` + explicit `@typescript-eslint/parser` for Vue `<script>` blocks (required because `@nuxt/eslint-config` v1.15.2 doesn't wire the TS parser automatically). `.prettierrc` added.
- **Scripts added**: `lint`, `lint:fix`, `format`, `typecheck` in `package.json`.
- **CI check workflow**: `.github/workflows/check.yml` runs `pnpm install`, `pnpm lint`, `pnpm typecheck` on push to main and all PRs.
- **README updated**: Real project description replacing the Nuxt starter boilerplate.

## Current state

- **Nuxt**: 3.21.4 with compatibility v4
- **@nuxt/ui**: 3.3.7
- **ESLint**: 10.2.1 via `@nuxt/eslint` 1.15.2
- **Prettier**: 3.8.3 with `prettier-plugin-tailwindcss`
- **pnpm**: 10.10.0

Known pnpm v10 behavior: on `pnpm install`, a warning appears about "Ignored build scripts: @parcel/watcher, esbuild, unrs-resolver, vue-demi". This is a new pnpm v10 build trust model. The `pnpm.onlyBuiltDependencies` field in `package.json` is set but pnpm v10.10.0 still shows the warning (UI glitch, not a functional issue). esbuild uses optional platform packages, so the binary is installed correctly regardless.

Color note: The `#ff0000` red placeholder is gone. Primary is now `violet`. Emerald accent (`#10b981`) is Phase 3 — will be wired into `@nuxt/ui` color tokens once full visual identity work begins.

Slabo 27px font: Still in `nuxt.config.ts` fonts config and `main.css` `@theme` because typography decisions are deferred to Phase 3 (`font-slabo` class is used in `Me.vue`). The "Retire Slabo 27px" locked decision will be executed in Phase 3 when final font choices are made.

## How to verify

```bash
pnpm install          # no errors
pnpm dev              # boots at http://localhost:3000, no console errors
pnpm lint             # exits 0
pnpm typecheck        # exits 0
pnpm build            # should produce .output/public
```

Check visually:
- Dark/light toggle button renders (moon/sun icon) and the view-transition animation works
- GitHub nav link in header goes to real GitHub URL

## Open / deferred

- **pnpm build scripts warning**: `onlyBuiltDependencies` shows warning but is functionally fine. Future pnpm upgrade may fix the UX.
- **OG image**: Removed placeholder. Phase 3 will add the monogram-based PNG.
- **Emerald accent color**: Defined as a decision but not yet wired. Phase 3 handles full visual identity.
- **Slabo 27px retirement**: Deferred to Phase 3 (typography phase).
- **Me.vue bio copy**: Still says "Kognity" — Phase 2 moves content to data files and translates/updates copy.
- **Dependabot PRs**: The new `pnpm-lock.yaml` obsoletes the yarn-based ones. Verify on GitHub that those PRs are now stale/closed.
- **PyPI icon**: Used `logos:pypi` — verify it renders correctly in the browser. If not, swap to `mdi:language-python` or similar.

## Phase 2 — refined plan

Read first:
- `app/components/about/WorkExperiences.vue`
- `app/composables/useWorkExperience.ts`
- `app/components/about/Skills.vue`
- `app/pages/projects.vue`
- `/Users/arthurvasconcelos/repos/personal/resume/ArthurVasconcelosCV.tex` — source of truth for experience/skills

Tasks:
- [ ] Install + configure `@nuxtjs/i18n` with en-GB (default, no prefix), pt-BR, sv.
- [ ] Create `app/data/work-experiences.ts` — port the 9 roles from the CV.
- [ ] Create `app/data/skills.ts` — categorized using CV taxonomy.
- [ ] Create `app/data/projects.ts` — Overseer family + sqlalchemy-seedling + legacy.
- [ ] Migrate `WorkExperiences.vue`, `Skills.vue`, `projects.vue` to consume data files.
- [ ] Translate all visible UI strings into en-GB, pt-BR, sv message catalogs.
- [ ] Add a locale switcher to `AppHeader.vue`.
- [ ] Update `Me.vue` bio copy to reflect Platform24 reality (and move the copy to i18n catalog).
- [ ] Write `.claude/handoffs/phase-2.md`.
