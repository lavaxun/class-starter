# class-starter

[Read this in Chinese → README.zh.md](README.zh.md)

This is a **starter project** for whatever you want to build. When it runs, you'll see a congratulations page.

**Start by checking that it runs on your laptop.** If it runs, your development tools (Node, git, an editor) are set up correctly, and you can start building.

You can ask your coding agent to download and set up this project, or follow the steps below yourself.

Open this folder in your coding agent. Its `AGENTS.md` has it ask what the project is for before writing code.

---

## Doing it by hand (about 10 minutes)

**Step 1 · Open a terminal**

- **Mac**: press `Cmd + Space`, type `Terminal`, press Enter
- **Windows**: search the Start menu for `PowerShell` and open it (⚠️ not "Command Prompt" / cmd)

**Step 2 · Go to the folder where you keep your projects**

In the terminal, type `cd ` (with a space), followed by the folder's location, then press Enter. Choose a folder on this laptop rather than a cloud-synced folder.

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

**Step 5 · Open this folder in your coding agent** and tell it what you want to build.

---

## Common problems

| Problem | Fix |
|---|---|
| `npx` or `npm` says "command not found" | Node isn't installed properly. Install Node, then **close and reopen the terminal** and try again |
| `npm install` hangs for a long time or shows errors | Switch networks (a phone hotspot is often faster) and run `npm install` again |
| The page won't open | Make sure the terminal is still open and `npm run dev` is still running (close it and the page stops) |
| You want to stop it | Press `Ctrl + C` in the terminal. To start again, go into the `class-starter` folder and run `npm run dev` |
| Stuck for more than 10 minutes | Ask whoever set this up for you, and show them the error message |

---

## Don't delete this folder

Keep your work in this folder. Its `AGENTS.md` contains the project's notes, including the tech stack and ground rules.

Feel free to click around. If you want a fresh copy, stop the server, rename the old `class-starter` folder to `class-starter-old`, then run the commands above again from its parent folder. Keep the old folder until you've saved any work or data you need.
