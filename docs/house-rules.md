# Workshop house rules (English mode)

House rules come in two parts:

1. **How to talk to me** goes into the ChatGPT app itself, at the start of Day 1. Every chat and every Codex project then follows it, and you always know where to find and change it.
2. **Project rules** go into this project's `AGENTS.md` (the file Codex reads for this project's rules). Codex copies them in on Day 1, afternoon step 1. In English mode, `AGENTS.md` stays English only.

## Part 1: How to talk to me (start of Day 1)

1. In the ChatGPT desktop app, open **Settings** (Mac: Cmd+, · Windows: Ctrl+,) > **Personalization** > **Custom instructions**. If you see an **Enable customization** switch, turn it on.
2. Copy the rules below and paste them into the box. If it already has text you want to keep, paste these underneath. Save.

```text
- I run a business; I'm not a technical person. Don't use technical jargon.
- If a technical word is unavoidable, first explain what it is in one plain sentence.
- Reply in simple English.
- Don't ask me to choose technical options (which library, which database). You decide, then tell me in one sentence what you picked and why.
- Report progress as "what you can do now", not which files or functions changed.
- After each step, tell me: which address to open, where to click, and what I should see.
```

You can change these any time in the same place. If a project's `AGENTS.md` says something different, the project's rule wins inside that project.

## Part 2: Project rules (Codex copies everything below the line into `AGENTS.md`)

---

## What this project is

<!-- This section is still empty. -->

**⚠️ The first time we talk about this project, don't write code yet.** Ask me the 4 questions below in order, **one at a time**, and wait for my answer before asking the next:

1. Who is this for? (e.g. "the 5 people on my customer service team")
2. What is the most annoying, time-wasting task right now? (e.g. "we keep forgetting to follow up with customers")
3. Once it's built, what does success look like? (e.g. "every morning I can see at a glance who to follow up with today")
4. Do they usually use it on a phone or a computer?

When you're done asking, fill my answers into the blanks below, **delete the questions above and this line's comment**, then show it to me for a quick check. Read this section first every time we start work.

- **Who uses it**: <to fill in>
- **What it solves**: <to fill in>
- **What success looks like**: <to fill in>
- **Phone or computer**: <to fill in>

## Tech stack

- **Next.js (App Router)** + **TypeScript**
- Styling with **Tailwind**; prefer the ready-made shadcn/ui components in `src/components/ui/`
- **Mobile-first responsive web**: design the phone layout first, then adapt for desktop (Tailwind responsive classes), since many colleagues use their phones
- Charts with **recharts** (already installed)
- All data reads and writes go through `store` in `src/lib/followups.ts`
- ⚠️ This is **Next.js 16** (quite new), and some patterns differ from older tutorials online. When unsure, follow the patterns already in this project.

## Ground rules

- Change one small piece at a time, and let me check it before moving on
- Only touch the files you need to; don't change other things along the way
- If you're not sure what I want, ask me; don't guess and carry on
