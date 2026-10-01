# class-starter

[Read this in Chinese → README.zh.md](README.zh.md)

This is the **pre-class setup check**. When it runs, you'll see a congratulations page. On Day 1 you build your dashboard right here in `class-starter`. Later projects (such as `AI HR`) each get their own copy of it, beside `class-starter`; Codex makes the copy for you.

**It has one job: run on your laptop.** If it runs, your development tools (Node, git, an editor) are set up correctly, and you can start building on Day 1.

**Easiest way: follow your pre-class guide.** Codex (the coding agent inside the ChatGPT Desktop App) clones this project into `AI Class/class-starter` in your home folder, downloads `AI Class/AGENTS.md` (it sets up a new project folder when you start work directly in `AI Class`), installs everything, and opens the page for you. You don't need the commands below.

Use the steps below only if you'd rather do it by hand, or if a helper asks you to.

---

## Doing it by hand (about 10 minutes)

**Step 1 · Open a terminal**

- **Mac**: press `Cmd + Space`, type `Terminal`, press Enter
- **Windows**: search the Start menu for `PowerShell` and open it (⚠️ not "Command Prompt" / cmd)

**Step 2 · Go to your course folder** (`AI Class` in your home folder, not on the Desktop or in OneDrive; this creates it if it's missing)

Mac:
```bash
mkdir -p ~/"AI Class" && cd ~/"AI Class"
```

Windows (PowerShell):
```powershell
New-Item -ItemType Directory -Force "$HOME\AI Class"; Set-Location "$HOME\AI Class"
```

**Step 3 · Run these 4 commands one at a time** (wait for each to finish before pasting the next)

```bash
git clone https://github.com/lavaxun/class-starter.git
```
> Downloads the project into a folder called `class-starter`

```bash
cd class-starter
```
> Moves into that folder

```bash
npm install
```
> Installs the parts the project needs. **This takes a few minutes**, and lots of scrolling text is normal

```bash
npm run dev
```
> Starts it! When you see `Local: http://localhost:3000`, it's running

**Step 4 · Open your browser** and go to **http://localhost:3000**

A big "Congrats! 🎉" page = success ✅

![What it looks like when it runs](docs/success.png)

**Step 5 · Bring this laptop to class**: this exact one, since everything is installed on it 🎉

---

## Common problems

| Problem | Fix |
|---|---|
| `npx` or `npm` says "command not found" | Node isn't installed properly. Install Node, then **close and reopen the terminal** and try again |
| `npm install` hangs for a long time or shows errors | Switch networks (a phone hotspot is often faster) and run `npm install` again |
| The page won't open | Make sure the terminal is still open and `npm run dev` is still running (close it and the page stops) |
| You want to stop it | Press `Ctrl + C` in the terminal. To start again, go into the `class-starter` folder and run `npm run dev` |
| Stuck for more than 10 minutes | Don't struggle alone. Come a little early on Day 1 and we'll sort it out with you on the spot |

---

## Don't delete this folder

`AI Class` holds one folder per project side by side: `class-starter`, then your class projects such as `AI HR` or `AI CRM`. Do each project in its own folder. This project's `AGENTS.md` carries its own complete rules (tech stack, keeping `data/` safe), so Codex follows them when you open `class-starter` itself. `AI Class/AGENTS.md` only acts as a receptionist: if you start a task directly in `AI Class`, Codex asks where the project belongs and creates its folder, with its own `AGENTS.md`, before doing the work. Your business profile and how Codex should talk to you (plain words, no technical jargon) belong in `Settings › Personalization › Custom instructions › Codex`; Part 1 shows you how.

Feel free to click around beforehand. If you break something, that's fine: rename the old `class-starter` folder to `class-starter-old`, then run the commands above again and you'll get a fresh copy.
