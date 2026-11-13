# AGENTS.md

> Notes for the coding agent in this project.

## How to work with me

- **I'm not a programmer.** Do the technical work yourself. Tell me only what I need to do or look at, in plain everyday words.
- Reply in the language I write in.
- You decide how to build it. Ask me only about what the app should do or how it should look, then tell me in one sentence what you decided.
- For anything bigger than a small fix, show me a short plan first, then build the whole plan without stopping to check in after each step.
- When something is ready, tell me what to open and what I should see.

## What this project is

This project's facts live in `PROJECT.md` in this folder. **Read `PROJECT.md` before any work.** Keep project facts there. Never edit this `AGENTS.md`. `npm run doctor` replaces it with the latest course version.

**If `PROJECT.md` does not exist yet, don't write code yet.** Ask me the 4 questions below in order, **one at a time**, and wait for my answer before asking the next. Skip any question my first message already answers.

1. Who is this for? (e.g. "the 5 people on my customer service team")
2. What is the most annoying, time-wasting task right now? (e.g. "we keep forgetting to follow up with customers")
3. Once it's built, what does success look like? (e.g. "every morning I can see at a glance who to follow up with today")
4. Do they usually use it on a phone or a computer?

When you're done asking, create `PROJECT.md` with these lines filled in with my answers, then show it to me for a quick check.

- **Who uses it**: <to fill in>
- **What it solves**: <to fill in>
- **What success looks like**: <to fill in>
- **Phone or computer**: <to fill in>

## Tech stack

You set these up and run them yourself. Don't explain them to me unless I must do something.

- **Next.js 16 (App Router)** + **TypeScript**. Next.js 16 is new. When unsure, follow the patterns already in this project.
- **Frontend:** Tailwind and shadcn/ui. Explore their blocks, charts and themes, and combine them into a look made for this business.
- Design the website for both mobile and desktop view.
- Charts can use **Recharts**.
- **Database:** Supabase, through the `supabase` CLI only (already signed in). Change the database with migrations and `supabase db push --remote`. Run one-off SQL with `supabase db query --remote`. Ask me before anything that deletes or overwrites data.
- **Publishing:** Vercel, through the `vercel` CLI only (already signed in), for example `vercel deploy --prod`.

## Look and feel

- Choose a suitable theme based on the business brand, and make it visually pleasing.

## Ground rules

- **Secret keys** stay out of the chat, the code and GitHub. When we need one, create `.env.local` with a placeholder line and open it, so I paste the key there myself. When we publish, add it to Vercel's environment settings yourself. If I paste a key into the chat anyway, move it into `.env.local` and tell me to replace it with a new one.
- Use only libraries, fonts, images and icons that are free for business use (fonts: Google Fonts). Ask me before using anything paid.
