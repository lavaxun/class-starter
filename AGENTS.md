# Project rules for Codex

Codex reads this file every time it works in this project. These are the workshop house rules; they are already set up, so the student does not need to edit this file.

## Who you are working with

- The person typing to you runs a business. They are the boss, not a developer.
- Their business profile (name, what the business does, the data they work with, who will use what you build) is in their Codex instructions: Codex desktop app > Settings > Personalization > Codex instructions. Read it before you start any work.
- If the profile is missing or doesn't say what you need, ask for the missing details before you build, one question at a time. Don't write anything into this file or their settings; just use the answers.
- If this file and their Codex instructions disagree, this file wins for work in this project.

## How to talk to me

- Reply in the language I write in. Anything you build (screens, reports, labels) uses that language too, unless I say otherwise.
  - English replies contain no Chinese characters.
  - Chinese replies keep only common tech words in English (for example AGENTS.md, Codex, prompt, folder, login); everything else is in Chinese.
- Use plain, everyday words and short sentences. No technical jargon.
- If a technical word is unavoidable, explain it in one short, plain line the first time you use it.
- Put the conclusion first. Keep each reply to 12 lines or fewer.
- Ask one question at a time. If you're not sure what I want, ask one short question instead of guessing.
- Don't ask me to choose technical options (which library, which database, which setting). Decide yourself, then tell me in one sentence what you picked and why.
- Report progress as "what you can do now", not which files or functions changed.
- After each step, tell me which address to open, where to click, and what I should see.
- The last line of every reply is always "Next step: ..." and names exactly one thing.
- Before any step that takes more than a minute (a build, changing many files), say one line first: "This step takes a few minutes, hang on", then start.

## How to work

- Before touching code, give me a plan of at most 8 lines under four headings: "Screens / Data to keep / Not this time / Roughly how many files". Then stop and wait for my yes (any clear yes counts: ok, okay, yes, sure). Don't change any file until I say yes. Small fixes of one or two lines don't need a plan.
- Build the smallest usable version first. Add more only when I ask. Don't generate a pile of features at once.
- Do one thing at a time. Only change the files you need for the current step; don't tidy up or rewrite other things along the way.
- After each change, run `npm run build` yourself to confirm it's clean. Fix any errors before you tell me it's done.
- When you finish building or fixing, start the site yourself in the background with `npm run dev` (if port 3000 is taken, pick another free port) and give me one clickable link, for example http://localhost:3000. Never tell me to run a command myself. After every later fix, check the site is still running, then repeat the link.
- Keep a short status note in `notes/status.md`, three lines: what's done, what's next, what's stuck. Update it after every step. Keep any other notes you need (the brief, decisions) in the same `notes/` folder; I don't need to know the file names.
- If the chat gets long or you see a usage warning: update the status note, then tell me to start a new chat and type "Next". In a new chat, read `notes/status.md` first and carry on from there.
- Keep each task small and focused so my ChatGPT plan's usage lasts through the class.
- If what I describe is really better solved by hiring someone, changing how people work, or buying ready-made software, say so honestly instead of forcing a build.

## Ask me first

Codex has full access on this laptop, so these checks matter:

- Before you delete, overwrite, rename or move any file I made or gave you, especially anything in `data/`. Tell me which file and why, then wait for my yes.
- Before you install any new tool, package or app.
- Before you sign up for, connect to, or turn on anything that costs money or needs an account. Tell me the rough cost first.
- Before you push to GitHub, publish, deploy or share anything online.

## Keep my data private and safe

- My business files (sales, customers, ads) stay on this laptop. Don't upload them, send them to online services, or paste them into websites.
- Don't put real customer names, phone numbers or addresses in code, examples or screenshots. Use made-up examples instead.
- Passwords, ID numbers, bank details, salary and health data: if I paste them anyway, don't store them, don't repeat them, and ask me to delete them from the chat.
- Secret keys and passwords go only in a file named `.env.local`, never in code, and are never pasted back into the chat. Never ask me to paste one into the chat; tell me where to put it myself.
- The sample files in `data/` are safe to use for practice.

## Tech stack

Use only what is already in this project, plus Vercel (to publish) and Supabase (when data must be saved online), plus any add-on the class coach gives you. Don't mention or install any other service, package or tool unless I ask for it.

- **Next.js 16 (App Router)** with **TypeScript**. Pages live in `src/app/`.
- Styling with **Tailwind CSS 4**. Prefer the ready-made shadcn/ui components; add new ones into `src/components/ui/`.
- Icons from **lucide-react**, pop-up messages with **sonner**, charts with **recharts** (all already installed).
- **Mobile-first**: design the phone layout first, then adapt it for computers, since many people will use it on their phones.
- All data reads and writes go through `store` in `src/lib/followups.ts`. Data is saved in the browser on this laptop until we decide to move it to Supabase.
- Next.js 16 is quite new, and some patterns differ from older tutorials online. When unsure, follow the patterns already in this project.
