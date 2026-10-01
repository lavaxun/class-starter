# Project rules for Codex

Codex reads this file every time it works in this project. These rules are complete on their own and already set up; the student does not need to edit this file.

## This project

- This project started as `class-starter`, the pre-class setup check and the template for new class web apps. Copies of it become class projects, and these rules come along with each copy.
- If this folder is named `class-starter`, keep it working as a clean template and don't build a class project here. A new project gets its own folder beside it, directly inside `AI Class` (for example `AI Class/AI HR/`): copy this folder there without `node_modules`, `.next` or `.git`, run `npm install` inside the new folder, and carry on the work there.
- If this folder has any other name, it is a copy and this folder is the project: build here.
- Never write absolute paths (such as `/Users/...` or `C:\Users\...`) into code, notes or settings; use paths relative to this folder.

## Who you are working with

- The person typing to you runs a business. They are the boss, not a developer.
- Their business profile (name, what the business does, the data they work with, who will use what you build) and how they want you to reply are in `Settings › Personalization › Custom instructions › Codex`. Read them before you start any work.
- If the profile is missing or doesn't say what you need, ask for the missing details before you build, one question at a time. Don't write anything into this file or their settings; just use the answers.
- If this file and their Codex instructions disagree about how to build or keep data safe in this project, this file wins.

## How to work

- Anything you build (screens, reports, labels) uses the language I write in, unless I say otherwise.
- Before touching code, give me a plan of at most 8 lines under four headings: "Screens / Data to keep / Not this time / Roughly how many files". Then stop and wait for my yes (any clear yes counts: ok, okay, yes, sure). Don't change any file until I say yes. Small fixes of one or two lines don't need a plan.
- Build the smallest usable version first. Add more only when I ask. Don't generate a pile of features at once.
- Do one thing at a time. Only change the files you need for the current step; don't tidy up or rewrite other things along the way.
- Don't ask me to choose technical options (which library, which database, which setting). Decide yourself, then tell me in one sentence what you picked and why.
- After each change, run `npm run build` yourself in this folder to confirm it's clean. Fix any errors before you tell me it's done.
- When you finish building or fixing, reuse this project's verified running server or start `npm run dev` in this folder on a free port without changing another app. Verify this project's page, not merely an occupied port, and give me its actual clickable URL. Check the page's title, description and body with 3-second localhost requests. Observe startup for 150 seconds without stopping the server; a still-running server whose page is unconfirmed is not a failed startup. Inspect its page and log before starting another copy. Never tell me to run a command myself. After every later fix, verify the page and repeat its actual link.
- Before browser instructions, inspect the current page and name only controls that are present. If you cannot see it, ask one short question about what I see. Keep a working page unchanged. If an embedded login page is blank or spinning for about 30 seconds, inspect its state, then open the same URL in my normal browser without restarting login.
- Checking whether I'm signed in to Vercel or Supabase must never start a login. Don't run `vercel whoami` or `supabase projects list` by hand. Check saved Vercel credentials first and keep any token already set in the environment; run read-only checks with `CI=1`, closed input and a 30-second limit. Missing credentials mean not signed in; unreadable credentials, a timeout, a network or permission error, or any unclear answer mean unknown, never permission to log in again. Look for saved sign-ins and a login that is still waiting before starting a new one; a command ending does not prove a sign-in expired. Never show secrets.
- For Supabase browser login, send the page's 8-character verification code to the still-waiting login command. Don't insist on an Approve button that isn't there, and don't ask for a long-lived token. A new login needs its own code.
- Keep a short status note in `notes/status.md`, three lines: what's done, what's next, what's stuck. Update it after every step. Keep any other notes you need (the brief, decisions) in the same `notes/` folder; I don't need to know the file names.
- If the chat gets long or you see a usage warning: update the status note, then tell me to start a new chat and type "Next". In a new chat, read `notes/status.md` first and carry on from there.
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

- **Next.js 16 (App Router)** with **React 19** and **TypeScript**. Pages live in `src/app/`.
- Styling with **Tailwind CSS 4**. Prefer the ready-made shadcn/ui components in `src/components/ui/` (built with `@base-ui/react`); add new ones there.
- Icons from **lucide-react**, pop-up messages with **sonner**, charts with **recharts** (all already installed).
- **Mobile-first**: design the phone layout first, then adapt it for computers, since many people will use it on their phones.
- Keep all data reads and writes in one place through `store` in `src/lib/followups.ts`. Data is saved in the browser on this laptop until we decide to move it to Supabase.
- Next.js 16 is quite new, and some patterns differ from older tutorials online. When unsure, follow the patterns already in this project.
