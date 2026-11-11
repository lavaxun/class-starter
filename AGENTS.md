# AGENTS.md

> Project notes for the coding agent working in this folder.

## How to talk to me

- **I'm not a programmer.** Do the technical steps yourself, and tell me only what I need to do or look at, in plain everyday words.
- Reply in the language I write in.
- Make technical decisions yourself, then tell me in one sentence what you decided.
- When a step is done, tell me what I should see.

## What this project is

Read this section first every time we start work.

<!-- This section is still empty. -->

**The first time we talk about this project, don't write code yet.** Ask me the 4 questions below in order, **one at a time**, and wait for my answer before asking the next. Skip any question my first message already answers.

1. Who is this for? (e.g. "the 5 people on my customer service team")
2. What is the most annoying, time-wasting task right now? (e.g. "we keep forgetting to follow up with customers")
3. Once it's built, what does success look like? (e.g. "every morning I can see at a glance who to follow up with today")
4. Do they usually use it on a phone or a computer?

When you're done asking, fill my answers into the blanks below, **delete the comment line, the "first time" paragraph, the 4 questions and this paragraph**, then show it to me for a quick check.

- **Who uses it**: <to fill in>
- **What it solves**: <to fill in>
- **What success looks like**: <to fill in>
- **Phone or computer**: <to fill in>

## Tech stack

You set these up and run them yourself. Don't explain them or their commands to me unless I must do something.

- **Next.js 16 (App Router)** + **TypeScript**
- Styling with **Tailwind** and the ready-made **shadcn/ui** components already in this project. shadcn/ui is a set of ready-made buttons, forms and tables. Set the colours and font once in its theme, so every button and chart changes together.
- **Mobile-first**: design the phone layout first, then adapt it for computers, since many people will use it on their phones
- Charts with **recharts**
- Next.js 16 is quite new, and some patterns differ from older tutorials online. When unsure, follow the patterns already in this project.
- Supabase: use the **Supabase CLI** only (already logged in). It comes with this project, so run it with `npx` from this folder: `npx supabase link`, SQL via migrations and `npx supabase db push`. Never use the Supabase plugin or connector, and never send me to the Supabase dashboard.
- Vercel: deploy with the **Vercel CLI** only (already logged in). It comes with this project, so run it with `npx` from this folder, for example `npx vercel deploy --prod`. Never use a Vercel plugin, connect GitHub, or send me to the Vercel dashboard.

## Look and feel

- Make it look like a well-known app used by this kind of business, one the owner would be proud to show.
- Before you build, choose a main colour, a font and a style that suit the business.
- Keep it clean: a light background, dark text, and the main colour only where it matters most.
- Show lists of items in a neat table or list, not big boxes.

## Ground rules

- Change one small piece at a time, and let me check it before you continue.
- Only touch the files the current step needs. Don't tidy up anything else along the way.
- If you're not sure what I want, ask me instead of guessing.
- Build in this folder, whatever it is named. Never write absolute paths (such as `/Users/...` or `C:\Users\...`) into code or settings.
- Secret keys: never ask me to paste a key into the chat. When we need one, create `.env.local` (it is gitignored) with a placeholder line and open it for me, or open a terminal, so I paste the key there myself. When we publish, add it to the hosting service's environment settings yourself. Never put keys in code or on GitHub, and never print a full key back to me. If I paste one into the chat anyway, move it into `.env.local` and tell me to rotate it.
- Only use libraries, fonts, images and icons that are free to use, even for business (for fonts, use Google Fonts). If something needs a paid or commercial licence and there is truly no free option, stop and ask me before you use it.

## Where truth lives

The code is the truth, and each doc below describes it. `desk doccheck` fails a change that touches a
Truth path without its Doc (`[no-doc]` in a commit message for a pure fix).

| Topic | Truth | Doc |
| --- | --- | --- |
| Run the starter and the success page | `package.json`, `next.config.ts`, `src/app/` | `README.md`, `README.zh.md` |
| Pre-class commands (setup, check, login, doctor) | `scripts/*.mjs` | (none yet) |
| Course rules written into AI Class | `scripts/house-rules.md` | (it is its own doc) |
| Ready-made UI parts and theme | `components.json`, `src/components/ui/`, `src/app/globals.css` | `AGENTS.md` |
| Sample data | `data/` | (none yet) |
| What is live | nothing deploys from this repo, because students deploy their own copy | `desk ctx class-starter` |
