# AGENTS.md

> Project notes for the coding agent working in this folder.

## How to talk to me

- **Avoid technical jargon.** Use plain, everyday words. If a technical word is unavoidable, explain it in one simple sentence the first time.
- Reply in the language I write in, and match the level of detail I ask for.
- Start with what it means for me. Add details only when they help.
- Explain new ideas/concepts by comparing them to things I already know.
- Make technical decisions yourself, then tell me briefly what you decided and why.
- Tell me what I can do now, not what you changed behind the scenes.
- After each step, let me know how to verify the work done and what I should see.

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

- **Next.js 16 (App Router)** + **TypeScript**
- Styling with **Tailwind**, preferring the ready-made **shadcn/ui** components already in this project
- **Responsive web app**: it works in phone and computer browsers. It is never a native phone app (no App Store, Play Store, Expo or React Native). Design first for the device named in "Phone or computer" above.
- Charts with **recharts**
- Next.js 16 is quite new, and some patterns differ from older tutorials online. When unsure, follow the patterns already in this project.
- Supabase: use the **Supabase CLI** only (already logged in): `supabase link`, SQL via migrations and `supabase db push`. Never use the Supabase plugin or connector, and never send me to the Supabase dashboard.
  - **Every new table needs GRANT + RLS in the same migration.** Since 30 Oct 2026, Supabase no longer exposes new tables in `public` to the app by default; without grants the app fails with error `42501` ("permission denied for table"). For each new table, in one migration:
    ```sql
    grant select, insert, update, delete on public.your_table to authenticated;
    grant select, insert, update, delete on public.your_table to service_role;
    alter table public.your_table enable row level security;
    create policy "users manage their own rows" on public.your_table
      for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
    ```
    Grant to `anon` only when signed-out visitors really must read the table, and then only `select`. If you see `42501`, add the missing grant in a new migration; never switch RLS off.
  - **Login is email + password.** Never use magic links or one-time email codes: Supabase's default email sender only reaches the project's own team members, about 2 emails per hour. Sign-up must not wait for an email to arrive.
  - A free Supabase project pauses after about 7 days with no use. If the database stops answering, tell me to open the Supabase dashboard and press **Restore project**.
- Vercel: deploy with the **Vercel CLI** only (already logged in), for example `vercel deploy --prod`. Never use a Vercel plugin, connect GitHub, or send me to the Vercel dashboard.
  - Add environment variables with `vercel env add`, as type **Secret** (not Config). Variables only reach **new** deployments, so redeploy (`vercel deploy --prod`) after adding or changing one.
  - Vercel Hobby (free) is for the class demo only: it is for personal, non-commercial use. Before my company uses this for real, remind me it needs Vercel Pro.

## Ground rules

- Change one small piece at a time, and let me check it before you continue.
- Only touch the files the current step needs. Don't tidy up anything else along the way.
- If you're not sure what I want, ask me instead of guessing.
- Build in this folder, whatever it is named. Never write absolute paths (such as `/Users/...` or `C:\Users\...`) into code or settings.
- Secret keys: never ask me to paste a key into the chat. Keys go in `.env.local`, which stays off GitHub, and into Vercel as Secret environment variables when we publish. Never put keys in code, and never print a full key back to me.
