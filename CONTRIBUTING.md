# Working on class-starter

For developers of this template. Students never need this file.

## What this repo is

class-starter is the project template each AI Class student gets. It lives in `AI Class/class-starter` on
their computer, and their coding agent works inside it. `AGENTS.md` is a student-facing product file: it is
what students' agents read, so keep developer notes out of its student sections.

## How a change reaches students

- Every merge to `main` reaches students: `npm run doctor` runs `git pull --ff-only` in their copy first.
  During class days, merge only what students may load at once.
- Students' agents write their project answers into the "What this project is" section of `AGENTS.md`. Before
  pulling, `doctor` keeps the student's notes from that section (the 4 answers and any lines no course version had),
  saves edits elsewhere in the file as a new `AGENTS.before-update*.md` that `AGENTS.md` then points to, and restores
  `AGENTS.md`. After the pull it puts the notes back into the new `AGENTS.md`. When the pull still fails, it checks out
  main's `AGENTS.md` alone and puts the notes back. Offline, it leaves `AGENTS.md` untouched.
- A copy from the time answers went into `PROJECT.md` gets them moved into `AGENTS.md` once its `AGENTS.md` is the
  new version, and `PROJECT.md` is deleted. When an answer there differs from the one in `AGENTS.md`, `PROJECT.md`
  stays and `AGENTS.md` points to it. That copy's old `doctor` pulls first and moves nothing, so run `doctor` twice.
- A copy whose `AGENTS.md` was filled in before this change runs an old `doctor` that cannot pull at all. Fix it once
  in that copy's `class-starter` folder (PowerShell or Terminal; on Windows use `npm.cmd`); later doctor runs then
  keep it current: `git fetch`, then `git checkout origin/main -- scripts/doctor.mjs`, then `npm run doctor`.
- ai-audit-radar's build downloads this repo's `AGENTS.md` and serves it as the class-site download. Its
  `npm run check` fails until the site is rebuilt and redeployed, so an `AGENTS.md` change needs a radar
  redeploy.
- Nothing deploys from this repo: each student deploys their own copy with the Vercel CLI.

## Pre-class commands

Each runs `node scripts/<name>.mjs`; the comment at the top of each file is its full contract.

| Command | What it does |
| --- | --- |
| `npm run setup` | Removes the course rules older versions wrote into `AI Class`, then prints the checklist. Safe to run again. |
| `npm run check` | Read-only checklist of five rows: Node.js and npm, the three sign-ins, the course page. Exit 0 only when all pass. |
| `npm run login [-- <service>]` | Signs in GitHub, Vercel and Supabase (only the ones still signed out); Supabase gets its own window. |
| `npm run doctor` | Updates class-starter, repairs each failed row, then shows the checklist again. |
| `npm run finish` | The last step: starts the course page in the background, opens it and shows the checklist window. |

## One rules file

This repo's `AGENTS.md` is the only rules file students' agents load; students open `class-starter` itself.
Nothing is written into `AI Class`: Claude Code also loads `AGENTS.md` and `CLAUDE.md` from parent folders, so files
there would reach every other project inside `AI Class`. Older versions wrote `AI Class/AGENTS.md` and
`AI Class/CLAUDE.md`; `setup` and `doctor` remove what those versions wrote and keep anything the student added.
`scripts/house-rules.md` stays as an empty block: an older `doctor` still reads it after its own pull, and crashes
without it. Its run writes the empty block once more, and the next `doctor` removes it.

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
| Ready-made UI parts and theme | `components.json`, `src/components/ui/`, `src/app/globals.css` | `AGENTS.md` |
| Sample data | `data/` | `CONTRIBUTING.md` |
| How a change reaches students | nothing deploys from this repo | `CONTRIBUTING.md` |
