# Benchwatch

Curated index of AI model leaderboards and benchmarks: what each one shows, who's on top, and how far to trust it.

## Stack
- Astro 7 with the Cloudflare adapter (`@astrojs/cloudflare`), deployed as the `benchwatch` Worker
- SolidJS for interactive islands only (currently `src/components/BenchmarkList.tsx`)
- Tailwind CSS 4 via `@tailwindcss/vite`; design tokens are CSS variables in `src/styles/global.css`
- Fonts self-hosted via Fontsource: Bricolage Grotesque (display), Public Sans (body)
- Server code, when needed: Effect v4 (RC as of Oct 2026) in `src/server/`, exposed through `src/pages/api/*` with `export const prerender = false`

## Deploy
Cloudflare Workers Builds is linked to `main`: every push builds (`npm run build`) and deploys (`npx wrangler deploy`). Don't push broken builds to `main`; run `npm run build` and `npx astro check` first.

## Content
All content lives in `src/data/benchmarks.json`, typed by `src/data/types.ts`.
- Prefer independently run numbers over vendor-reported ones, and record which in `independence`.
- Every benchmark needs `sourceUrls` and `lastChecked` (the date the source's data reflects, not today's date unless re-verified).
- Bump top-level `updated` whenever data is refreshed.
- Summaries are paraphrased in our own words. Never copy sentences from sources.
- Trust ratings: `high` = independent and still discriminates top models; `medium` = harness-dependent, partly self-reported or mixed versions; `low` = saturated, contaminated or unmaintained.
- Leaderboards change every few weeks: always re-check current leaders with web search before editing data.

## Design rules
- Performance first: pages prerender; ship JS only for real interactivity, hydrated with `client:idle` or `client:visible`.
- Light and dark themes come from tokens in `global.css`; use the Tailwind colour names (`ink`, `muted`, `rule`, `accent`, `high`, `medium`, `low`), not raw hex.
- Sentence case, plain language, no all-caps labels.
