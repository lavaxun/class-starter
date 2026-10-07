# class-starter

[Read this in Chinese → README.zh.md](README.zh.md)

This is a **starter project** for whatever you want to build. When it runs, you'll see a congratulations page.

**Start by checking that it runs on your laptop.** If it runs, your development tools (Node, git, an editor) are set up correctly, and you can start building.

## Set up with your coding agent

**Create an empty folder yourself**, anywhere you choose on this laptop. This folder is your project. Choose a local folder rather than a cloud-synced folder if possible.

Select that exact folder as the **primary LOCAL project folder** in your coding app, then start a **new chat** there. You do not need to select another folder after setup.

Paste this into the chat:

> I selected the English guide. Reply in English and use English for screens, reports and labels unless I ask otherwise. Set up https://github.com/lavaxun/class-starter directly in the selected project folder, not in a folder inside it. First show me the full path and wait for me to confirm it. Follow this README's folder checks and house-rules procedure, preserve the starter's AGENTS.md, and help me check http://localhost:3000. Before building my idea, follow AGENTS.md's project-discovery questions.

### Folder checks for the agent

1. Read the chat's current folder: Mac `pwd -P`; Windows `(Get-Location).Path`. Call this path `ROOT`. Say **“I will work in ROOT”** using the real path, and wait for confirmation before downloads or writes. If it is wrong, stop and ask the student to select the correct primary local folder and start a new chat there.
2. Check what is in `ROOT`, ignoring only `.DS_Store`, `Thumbs.db` and `desktop.ini`:
   - **Empty:** install directly into `ROOT` using the four Git commands in the manual route below.
   - **Recognized starter:** `git -C "<ROOT>" remote get-url origin` must point to `github.com/lavaxun/class-starter`, using HTTPS or SSH, with or without `.git`. If `git -C "<ROOT>" rev-parse -q --verify HEAD` fails, reuse its origin and run only the fetch and checkout commands below. Otherwise update only with `git -C "<ROOT>" pull --no-rebase --ff-only`. If that fails, keep the current copy; never stash, reset or delete.
   - **Anything else:** write nothing. This includes unrelated files, an old non-Git copy, or a home/Desktop/Documents folder selected by mistake. Explain what is there and ask the student to create a new empty folder, select it as the primary local project folder and start a new chat there. Never move, rename, delete or overwrite existing work.
3. Recheck the folder classification before writes if its contents have changed. Stop on any failed setup command; do not continue with the next command blindly.
4. Keep all project files in `ROOT`. Do not create a starter child folder, a course parent folder or an automatic “AI Class” home. Read the installed `AGENTS.md`, add the house rules below, then run `npm install` and `npm run dev` in the same folder.

---

## Add the class house rules

**Ask your agent to do this after installing or updating the starter.** The manual route uses this same procedure. Keep these project instructions standalone and usable in any coding app.

1. Download https://preclass.aiclassmalaysia.com/house-rules.md to a **separate temporary file**, never directly over `AGENTS.md`. If the download fails, remove the temporary file and retry the download; do not invent the rules or continue with missing rules.
2. Read both `<ROOT>/AGENTS.md` and the downloaded block, from `<!-- ai-class-house-rules:start -->` through `<!-- ai-class-house-rules:end -->`.
3. Apply only the matching case:
   - **No `AGENTS.md`:** create it with the downloaded marked block.
   - **No marked block:** append a blank line and the downloaded block once. Preserve every existing starter instruction.
   - **Identical marked block:** change nothing.
   - **Different marked block:** ask, **“Would you like to keep your current class rules (recommended if unsure), or replace only the class rules block with the latest version?”** Wait for the answer. Default to keeping it. Only explicit approval permits replacing that marked section; preserve all text outside it.
4. Remove the temporary file after use. Never overwrite the whole starter `AGENTS.md`.

---

## Doing it by hand (about 10 minutes)

This is optional. Use the **same empty folder you created and selected above**, not a new folder inside it. If you have not done that yet, create the folder, select it as the primary LOCAL project folder and start a new chat before continuing.

**Step 1 · Open a terminal**

- **Mac**: press `Cmd + Space`, type `Terminal`, press Enter
- **Windows**: search the Start menu for `PowerShell` and open it (⚠️ not "Command Prompt" / cmd)

**Step 2 · Go to your selected project folder**

Replace the example path with your folder's full path. Keep the quotes, especially if the path has spaces. In a PowerShell single-quoted literal path, double every apostrophe (`'`) inside the path.

**Mac:**

```bash
cd "/Users/your-name/your-project"
pwd -P
```

**Windows (PowerShell):**

```powershell
Set-Location -LiteralPath 'C:\Users\your-name\your-project'
(Get-Location).Path
```

Have your agent show the full absolute path as `ROOT`, wait for you to confirm it is your selected project folder, and classify its contents using the **Folder checks** above **without downloads, writes or installation**. Only an empty `ROOT` proceeds to the manual-route Git commands below. If an existing or half-finished starter is there, switch to **Set up with your coding agent** above; do not rerun `git init` or `git remote add`. If there are unrelated files, stop without writes and create a new empty project folder.

**Step 3 · Download into this folder**

Run these **four commands one at a time**, on either platform. Wait for each to finish. **If any command fails, stop and show the error to your agent; do not run the next command.** Recheck the folder if its contents changed since the folder checks.

```bash
git init -q
```

```bash
git remote add origin https://github.com/lavaxun/class-starter.git
```

```bash
git fetch -q origin
```

```bash
git checkout -q -b main --track origin/main
```
> Downloads the starter directly into your selected folder. No GitHub account or SSH key is needed.

**Step 4 · Add the class house rules**

In the same chat, ask your agent to read the installed `AGENTS.md` and follow **Add the class house rules** above. It must preserve the starter's instructions, not replace the file.

**Step 5 · Install and start**

Run these in the same terminal, still in your selected project folder. Wait for each command to finish successfully before running the next.

```bash
npm install
```
> Installs the parts the project needs. **This takes a few minutes**, and lots of scrolling text is normal

```bash
npm run dev
```
> Starts it! When you see `Local: http://localhost:3000`, it's running

**Step 6 · Open your browser** and go to **http://localhost:3000**

A big "Congrats! 🎉" page = success ✅

![What it looks like when it runs](docs/success.png)

**Step 7 · Tell your coding agent what you want to build**, in the same chat and selected folder.

Its `AGENTS.md` asks who the project is for, what problem it solves, what success looks like, and whether people use a phone or computer, one question at a time before writing code. It also records the starter's stack: **Next.js 16 + TypeScript**, **Tailwind + shadcn/ui**, mobile-first layouts and **recharts** for charts.

---

## Common problems

| Problem | Fix |
|---|---|
| `npx` or `npm` says "command not found" | Node isn't installed properly. Install Node, then **close and reopen the terminal** and try again |
| `npm install` hangs for a long time or shows errors | Switch networks (a phone hotspot is often faster) and run `npm install` again |
| The page won't open | Make sure the terminal is still open and `npm run dev` is still running (close it and the page stops) |
| You want to stop it | Press `Ctrl + C` in the terminal. To start again, go into your selected project folder and run `npm run dev` |
| Stuck for more than 10 minutes | Ask whoever set this up for you, and show them the error message |

---

## Keep this folder for this project

Keep your work in this folder. Its `AGENTS.md` contains the project's notes, including the tech stack and ground rules.

Keep using this same folder for later lessons or changes to **the same project**. For **a different project**, manually create a new empty folder, select it as the primary LOCAL project folder and start a new chat there. Follow the setup steps in that new folder; leave the old project and its files untouched.
