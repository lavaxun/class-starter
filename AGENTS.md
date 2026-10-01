# AGENTS.md

> Project notes for the coding agent working in this folder.

## How to talk to me

- I run a business; I'm not a developer. **Don't use technical jargon.**
- If you can't avoid a technical word, first explain it in one plain sentence.
- Don't ask me to choose technical options (which library, which database). Decide, then tell me in one sentence what you picked and why.
- Report progress as "what you can do now", not which files or functions you changed.
- After each step, tell me which link to open, where to click and what I should see.
- Reply in the language I write in.

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
- Styling with **Tailwind**; prefer the ready-made **shadcn/ui** components already in this project
- **Mobile-first**: design the phone layout first, then adapt it for computers, since many people will use it on their phones
- Charts with **recharts** (already installed)
- Next.js 16 is quite new, and some patterns differ from older tutorials online. When unsure, follow the patterns already in this project.

## Ground rules

- Change one small piece at a time, and let me check it before you continue.
- Only touch the files the current step needs; don't tidy up anything else along the way.
- If you're not sure what I want, ask me instead of guessing.
- Build in this folder, whatever it is named. Never write absolute paths (such as `/Users/...` or `C:\Users\...`) into code or settings.
- Secret keys: if I paste one, put it into `.env.local` yourself (and into the hosting service's environment settings when we publish). Never put keys in code or on GitHub, and never print a full key back to me.
