# class-starter

[Read this in Chinese → README.zh.md](README.zh.md)

For an already-installed standalone starter, run the existing project, check the congratulations page, then tell your coding agent what you want to build.

## Run the project

Open a terminal in this project folder and run:

```bash
npm run dev
```

Keep the terminal open while using the app. Open **http://localhost:3000**, or the URL shown in your terminal if it is different.

To stop, press `Ctrl + C`. To restart, run `npm run dev` again in the same project folder.

## Success: start building

The congratulations page means the starter is running.

![What it looks like when it runs](docs/success.png)

Tell your coding agent what you want to build. Before writing code, it must read the existing `AGENTS.md` and follow its project-discovery guidance: ask **one question at a time** about who it's for, what problem it solves, what success looks like, and whether people use a phone or computer. Skip questions you have already answered.

Claude Code reads `CLAUDE.md`, which imports the same instructions from `AGENTS.md`.

## Tech stack

Follow the existing project patterns and stack notes in `AGENTS.md`: **Next.js 16 (App Router) + TypeScript**, **Tailwind + shadcn/ui**, a **responsive web app** (phone and computer browsers, never a native phone app), and **recharts** for charts.

## Database and login

Follow `AGENTS.md` and use the **Supabase CLI only**. Every new table gets **GRANT + RLS** in the same migration (since 30 Oct 2026; otherwise the app shows error `42501`). Login is **email + password**, never a magic link. Email confirmation is off for the class demo; switch it back on with your own email sender (custom SMTP) before real company use. A free Supabase project pauses after about 7 days with no use; press **Restore project** in the Supabase dashboard if that happens.

## Deploy

Follow `AGENTS.md` and use the **Vercel CLI only**, for example `vercel deploy --prod`. Do not use a Vercel plugin, connect GitHub, or use the Vercel dashboard for deployment.

Add keys as environment variables of type **Secret** with `vercel env add`, then redeploy: changes only reach new deployments. Keys stay in `.env.local` on your computer and never go on GitHub.

Vercel Hobby (free) is for the class demo only. Real company use needs Vercel Pro.

## Troubleshooting

| Problem | Fix |
|---|---|
| Page won't open | Check the terminal's URL and that `npm run dev` is still running. |
| Want to stop or restart | Press `Ctrl + C`; restart with `npm run dev` in this same project folder. |
| An error appears or you're still stuck | Show the error to your coding agent or the person helping you. |

## Continue this project

Use the same project folder and chat for later lessons or changes. Read the existing `AGENTS.md` for the project's notes and ground rules.
