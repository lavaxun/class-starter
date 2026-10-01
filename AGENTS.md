# Project rules for Codex

Codex reads this file every time it works in this project. These rules are complete on their own and already set up; the student does not need to edit this file.

## This project

- This project started as `class-starter`, the pre-class setup check that becomes the Day 1 dashboard. Build in this folder, whatever it is named.
- A new, different project (for example `AI HR`) gets its own folder that the student makes directly inside `AI Class`, with a fresh copy of this file in it. Build in that folder. If it has no code yet, copy the code from `class-starter` into it, keeping `node_modules` so nothing has to download again, and leaving out `.next`, `.git` and `notes/`. Keep that folder's own `AGENTS.md`, and never make another folder for the same project.
- Never write absolute paths (such as `/Users/...` or `C:\Users\...`) into code, notes or settings; use paths relative to this folder.

## What this project is

Read this section first every time we start work. While the four lines at the end of this section still say `<to fill in>`, ask me about this project one question at a time, waiting for each answer: who it's for, the most annoying task right now, what success looks like, phone or computer. Skip any question my first message already answers. If my first message is a project interview, let it replace these questions and fill the four lines from my answers.

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

## Who you are working with

- The person typing to you runs a business. They are the boss, not a developer.
- Their business profile (name, what the business does, the data they work with, who will use what you build) and how they want you to reply are in `Settings › Personalization › Custom instructions › Codex`. Read them before you start any work.
- If the profile is missing or doesn't say what you need, cover the gaps through the questions under "What this project is" and "How to work". The only change you make to this file is filling in or resetting "What this project is" as that section describes; never edit the rest of this file or their settings.
- If this file and their Codex instructions disagree about how to build or keep data safe in this project, this file wins.

## How to work

- Anything you build (screens, reports, labels) uses the language I write in, unless I say otherwise.
- When I ask for something new, don't write code yet. If "What this project is" still has blanks, ask its 4 questions first, fill it in and show it to me (the one file change allowed before my yes). Then ask me these questions in plain words, one at a time, waiting for each answer, and offer 2-3 suggested answers I can pick from: 1. What should it do, and what wastes the most time today? 2. Who will use it, and on a phone or a computer? 3. What information will it use (for example a file in `data/`)? 4. Once it's built, what does success look like? Skip any question that "What this project is", my business profile or earlier answers already cover.
- Then summarise the plan in at most 8 lines under four headings: "Screens / Data to keep / Not this time / Roughly how many files". Stop and wait for my yes (any clear yes counts: ok, okay, yes, sure). Don't change any file until I say yes. Small fixes of one or two lines need neither the questions nor a plan.
- Build the smallest usable version first. Add more only when I ask. Don't generate a pile of features at once.
- Do one thing at a time. Only change the files you need for the current step; don't tidy up or rewrite other things along the way.
- Don't ask me to choose technical options (which library, which database, which setting). Decide yourself, then tell me in one sentence what you picked and why.
- After each change, run `npm run build` yourself in this folder to confirm it's clean. Fix any errors before you tell me it's done.
- When you finish building or fixing, reuse this project's verified running server or start `npm run dev` in this folder on a free port without changing another app. Verify this project's page, not merely an occupied port, and give me its actual clickable URL. Check the page's title, description and body with 3-second localhost requests. Observe startup for 150 seconds without stopping the server; a still-running server whose page is unconfirmed is not a failed startup. Inspect its page and log before starting another copy. Never tell me to run a command myself. After every later fix, verify the page and repeat its actual link.
- Before browser instructions, inspect the current page and name only controls that are present. If you cannot see it, ask one short question about what I see. Keep a working page unchanged. If an embedded login page is blank or spinning for about 30 seconds, inspect its state, then open the same URL in my normal browser without restarting login.
- Checking whether I'm signed in to Vercel or Supabase must never start a login. Don't run `vercel whoami` or `supabase projects list` by hand. Check saved Vercel credentials first and keep any token already set in the environment; run read-only checks with `CI=1`, closed input and a 30-second limit. Missing credentials mean not signed in; unreadable credentials, a timeout, a network or permission error, or any unclear answer mean unknown, never permission to log in again. Look for saved sign-ins and a login that is still waiting before starting a new one; a command ending does not prove a sign-in expired. Never show secrets.
- For Supabase browser login, send the page's 8-character verification code to the still-waiting login command. Don't insist on an Approve button that isn't there, and don't ask for a long-lived token. A new login needs its own code.
- Keep a short status note in `notes/status.md`, three lines: what's done, what's next, what's stuck. Update it after every step. Keep any other notes you need (plans, decisions) in the same `notes/` folder; the project brief stays in "What this project is" above. I don't need to know the file names.
- If the chat gets long or you see a usage warning: update the status note, then tell me to start a new chat and type "Next". In a new chat, read "What this project is" and `notes/status.md` first and carry on from there.
- Keep each task small and focused so my ChatGPT plan's usage lasts through the class.
- If what I describe is really better solved by hiring someone, changing how people work, or buying ready-made software, say so honestly instead of forcing a build.

## Ask me first

Codex has full access on this laptop, so these checks matter:

- Before you delete, overwrite, rename or move any file I made or gave you, especially anything in `data/`. Tell me which file and why, then wait for my yes.
- Before you install any new tool, package or app. Running `npm install` to install this project's existing packages does not need a separate yes.
- Before you sign up for, connect to, or turn on anything that costs money or needs an account. Tell me the rough cost first.
- Before you push to GitHub, publish, deploy or share anything online.

## Keep my data private and safe

- My business files (sales, customers, ads) stay on this laptop. Don't upload them, send them to online services, or paste them into websites.
- Don't put real customer names, phone numbers or addresses in code, examples or screenshots. Use made-up examples instead.
- Passwords, ID numbers, bank details, salary and health data: if I paste them anyway, don't store them, don't repeat them, and ask me to delete them from the chat.
- Secret keys and passwords go only in a file named `.env.local`, never in code, and are never pasted back into the chat. Never ask me to paste one into the chat; tell me where to put it myself.
- Never open or read `.env.local`, and never print its contents. I put the keys in it myself; you only need the variable names.
- The sample files in `data/` are safe to use for practice.

## Tech stack

Use only what is already in this project, plus Vercel (to publish) and Supabase (when data must be saved online), plus any add-on the class coach gives you. Don't mention or install any other service, package or tool unless I ask for it.

- **Next.js 16 (App Router)** with **React 19** and **TypeScript**.
- Styling with **Tailwind CSS 4**. Prefer **shadcn/ui** components (built with **Base UI**), reusing the ones already in this project.
- Icons from **lucide-react**, pop-up messages with **sonner**, charts with **recharts** (all already installed).
- **Mobile-first**: design the phone layout first, then adapt it for computers, since many people will use it on their phones.
- Data is saved in the browser on this laptop until we decide to move it to **Supabase**.
- Next.js 16 is quite new, and some patterns differ from older tutorials online. When unsure, follow the patterns already in this project.
