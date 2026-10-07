# class-starter

[Read this in Chinese → README.zh.md](README.zh.md)

A starter for your next project. First get the congratulations page running on your laptop, then tell your coding agent what you want to build.

## Set up with your coding agent

1. **Create an empty local folder yourself** on your laptop, preferably outside cloud-synced storage.
2. Select **that exact folder as the primary LOCAL project folder** in your coding app, then start a **new chat** there.
3. Paste this prompt:

```text
Reply in English; use English for screens, reports and labels unless I ask otherwise.
Read this chat's actual current working folder and show its full path.
Wait for my confirmation before downloads or writes.
If the path is wrong, stop; ask me to select the correct primary LOCAL folder
and start a new chat. If the folder isn't empty, don't overwrite anything;
ask me to create and select a new empty folder and start a new chat.
Install https://github.com/lavaxun/class-starter directly in the confirmed folder,
never in a nested folder, using the four Git commands below.
Stop if any setup command fails. Read and preserve the installed AGENTS.md.
Apply Class house rules below, then run npm install and npm run dev here.
Help me open the running page. Before building my idea, follow AGENTS.md's
project-discovery questions one at a time.
```

## Class house rules

Both setup routes use these rules after downloading the starter:

1. Download https://preclass.aiclassmalaysia.com/house-rules.md to a **separate temporary file**, never over `AGENTS.md`. If the download fails, stop and show the error.
2. Read the installed `AGENTS.md` and the downloaded block, including **both** exact markers:
   ```html
   <!-- ai-class-house-rules:start -->
   <!-- ai-class-house-rules:end -->
   ```
3. If the block is absent, append it **once**. If identical, leave it unchanged. If different, ask whether to keep it or replace it; **keep the current block** unless you explicitly approve replacing only that block. Preserve all text outside the block and never overwrite the starter's `AGENTS.md`.
4. Remove the temporary file after use. Stop on any failed setup command; fix the error before continuing.

## Optional: set up by hand

Use the same empty folder selected above. If you haven't selected it yet, do that and start a new chat first. In that chat, ask your agent to use English for communication, screens, reports and labels unless you request otherwise.

**1. Open a terminal and go to your folder.** Replace the example with your full path; keep the quotes.

**Mac:** open Terminal with `Cmd + Space`.

```bash
cd "/Users/your-name/your-project"
pwd -P
```

**Windows:** open PowerShell from Start (not Command Prompt).

```powershell
Set-Location -LiteralPath 'C:\Users\your-name\your-project'
(Get-Location).Path
```

In PowerShell, double any apostrophe inside the quoted path.

If navigation fails or the shown path isn't your selected folder, **stop before Git**. Ask your agent **only to read the chat's actual current working path, show it, wait for your confirmation, and check that the folder is empty—no downloads, writes or installation yet**. If the chat path is wrong, select the correct primary LOCAL folder and start a new chat. If the folder isn't empty, stop without overwriting anything; create and select a new empty folder and start a new chat.

**2. Download the starter directly into this folder.** Run these four commands **one at a time**. If any fails, stop and show the error to your agent; don't run the next command.

```bash
git init -q
git remote add origin https://github.com/lavaxun/class-starter.git
git fetch -q origin
git checkout -q -b main --track origin/main
```

No GitHub account or SSH key is needed. Do not create a nested project folder.

**3. Add the house rules.** Ask your agent to read the installed `AGENTS.md` and follow **Class house rules** above, preserving the starter's instructions.

**4. Install and start in the same folder.** Run `npm install` first; if it fails, stop and show the error. Only after it finishes successfully, run `npm run dev`.

```bash
npm install
npm run dev
```

Keep that terminal open while using the app.

## Success: start building

Open **http://localhost:3000**, or the URL shown in your terminal. The congratulations page means the starter is running.

![What it looks like when it runs](docs/success.png)

In the same chat, tell your agent what you want to build. Before writing code, it must read `AGENTS.md` and ask **one question at a time**: who it's for, what problem it solves, what success looks like, and whether people use a phone or computer.

Keep the stack notes in `AGENTS.md`: Next.js 16 + TypeScript, Tailwind + shadcn/ui, mobile-first layouts and recharts for charts.

## Troubleshooting

| Problem | Fix |
|---|---|
| `npm` isn't found | Install Node, then close and reopen the terminal. |
| Download or setup command fails | Stop and show the error to your agent before continuing. For network errors, try another network. |
| Page won't open | Check the terminal's URL and that `npm run dev` is still running. |
| Want to stop or restart | Press `Ctrl + C`; restart with `npm run dev` in this same folder. |
| Still stuck | Show the error to the person helping you. |

## Keep the same folder and chat

Use this same folder and chat for later lessons or changes to **this project**; `AGENTS.md` holds its notes and ground rules. For **a different project**, manually create a new empty folder, select it as the primary LOCAL project folder and start a new chat. Leave the old project's files untouched.
