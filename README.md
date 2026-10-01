# Benchwatch

Every AI leaderboard in one place, summarised, with an honest note on how far to trust each one.

**Stack:** Astro 7 · SolidJS islands · Tailwind CSS 4 · Cloudflare Workers (static assets at the edge)

## How it works

- All content lives in `src/data/benchmarks.json`. Edit that file to update the site; no code changes needed.
  - `hero`: the "who's #1 where" board at the top.
  - `quickAnswers`: the three short answers (agentic coding, value, open-weight).
  - `benchmarks`: one entry per leaderboard, with leader, takeaway, trust rating and the date its data reflects.
  - `integrityIssues`: the "Why scores mislead" timeline.
- Entries whose data is older than 60 days (`STALE_AFTER_DAYS` in `src/data/types.ts`) get an "x months old" flag automatically.
- The page is prerendered, so it ships as static HTML. The only JavaScript is the filterable list (`src/components/BenchmarkList.tsx`, ~8 kB), hydrated on idle.
- `/data.json` serves the dataset for agents and other tools.

## Develop

```sh
npm install
npm run dev        # http://localhost:4321
npm run preview    # build, then run locally in workerd via wrangler
```

## Deploy to Cloudflare

Option A, from your machine:

```sh
npx wrangler login
npm run deploy
```

Option B, auto-deploy on push: push this repo to GitHub, then in the Cloudflare dashboard go to Workers & Pages → Create → Import a repository. Build command `npm run build`, deploy command `npx wrangler deploy`.

The adapter adds a `SESSION` KV binding by default; Wrangler creates the namespace automatically on first deploy. Nothing uses it yet.

## Adding server routes (Effect)

Any route can opt out of prerendering with `export const prerender = false` and it will run in the Worker. Planned home for Effect v4 code: `src/server/`, called from `src/pages/api/*.ts`. Effect v4 is a Release Candidate as of October 2026.

## Updating the data

Each benchmark entry has `sourceUrls` and `lastChecked`. When refreshing, re-check the source, update the leader and score, and bump `lastChecked` and the top-level `updated`. Prefer independently run numbers over vendor-reported ones, and say which in `independence`.
