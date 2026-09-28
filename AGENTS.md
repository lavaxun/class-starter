# Project rules for Codex

Codex reads this file every time it works in this project. The house rules below are already filled in for the workshop. The student only fills in **About my business**.

## About my business

<!-- Student: replace each <fill in> with one or two short lines. Plain words are fine. -->

- **My name**: <fill in>
- **My business and what it does**: <fill in, e.g. "I sell baby clothes on Shopee and Facebook">
- **The data files I work with**: <fill in, e.g. "Shopee sales export and Facebook ads report, as CSV files">
- **Who reads what we build**: <fill in, e.g. "my 3 customer service staff, mostly on their phones">

Read this section before starting any work. If any line above still says `<fill in>`, don't write code yet: ask me for the missing lines one at a time, fill in my answers, and show me the section to check.

## How to work with me

- I run a business; I'm not a programmer. Use plain language and explain each step in a sentence or two.
- Work in small steps. After each step, tell me what I can do now, where to open or click, and what I should see.
- If you're not sure what I want, ask me one short question instead of guessing.
- Only change the files you need for the current step. Don't tidy up or rewrite other things along the way.
- Keep each task small and focused so my ChatGPT plan's usage lasts through the class.

## Ask me first

- Before you delete, overwrite, rename or move any file I made or gave you, especially anything in `data/`. Tell me which file and why, then wait for my yes.
- Before you install new tools or packages.
- Before you push to GitHub, publish, deploy or share anything online.

## Keep my data private and local

- My business files (sales, customers, ads) stay on this laptop. Don't upload them, send them to online services, or paste them into websites.
- Don't put real customer names, phone numbers or addresses in code, examples or screenshots; use made-up examples instead.
- Never ask me to paste passwords or login keys into the chat. If something needs one, tell me where to put it myself.
- The sample files in `data/` are safe to use for practice.

## Tech stack

- **Next.js (App Router)** + **TypeScript**
- Styling with **Tailwind**; prefer the ready-made shadcn/ui components in `src/components/ui/`
- **Mobile-first**: design the phone layout first, then adapt for computers, since many people read on their phones
- Charts with **recharts** (already installed)
- All data reads and writes go through `store` in `src/lib/followups.ts`; data is saved in the browser on this laptop
- This is **Next.js 16**, and some patterns differ from older tutorials online. When unsure, follow the patterns already in this project.
