# Working on class-starter

For developers of this template. Students never need this file.

## What this repo is

class-starter is the project template each AI Class student gets. It lives in `AI Class/class-starter` on
their computer, and their coding agent works inside it. `AGENTS.md` is a student-facing product file: it is
what students' agents read, so keep developer notes out of its student sections.

## How a change reaches students

- Every merge to `main` reaches students: `npm run doctor` runs `git pull --ff-only` in their copy first.
  During class days, merge only what students may load at once.
- ai-audit-radar's build downloads this repo's `AGENTS.md` and serves it as the class-site download. Its
  `npm run check` fails until the site is rebuilt and redeployed, so an `AGENTS.md` change needs a radar
  redeploy.
- Nothing deploys from this repo: each student deploys their own copy with the Vercel CLI.

## Pre-class commands

Each runs `node scripts/<name>.mjs`; the comment at the top of each file is its full contract.

| Command | What it does |
| --- | --- |
| `npm run setup` | Writes the course rules into `AI Class`, then prints the checklist. Safe to run again. |
| `npm run check` | Read-only checklist of five rows: Node.js and npm, the three sign-ins, the course page. Exit 0 only when all pass. |
| `npm run login [-- <service>]` | Signs in GitHub, Vercel and Supabase (only the ones still signed out); Supabase gets its own window. |
| `npm run doctor` | Updates class-starter, repairs each failed row, then shows the checklist again. |
| `npm run finish` | The last step: starts the course page in the background, opens it and shows the checklist window. |

## Course rules written into AI Class

`scripts/house-rules.md` holds the course rules. `setup` and `doctor` copy it between its markers into
`AI Class/AGENTS.md` and import that file from `AI Class/CLAUDE.md`. They never change this repo's
`AGENTS.md`.

## Sample data

`data/fb-ads-sample.csv` (daily ad spend per campaign) and `data/shopee-sales-sample.csv` (daily orders and
revenue per channel) are made-up data for class exercises.

## Where truth lives

The code is the truth, and each doc below describes it. When a change touches a Truth path, update its Doc
in the same change.

| Topic | Truth | Doc |
| --- | --- | --- |
| Run the starter and the success page | `package.json`, `next.config.ts`, `src/app/` | `README.md`, `README.zh.md` |
| Pre-class commands (setup, check, login, doctor, finish) | `scripts/*.mjs` | `CONTRIBUTING.md` |
| Course rules written into AI Class | `scripts/house-rules.md` | (it is its own doc) |
| Ready-made UI parts and theme | `components.json`, `src/components/ui/`, `src/app/globals.css` | `AGENTS.md` |
| Sample data | `data/` | `CONTRIBUTING.md` |
| How a change reaches students | nothing deploys from this repo | `CONTRIBUTING.md` |
